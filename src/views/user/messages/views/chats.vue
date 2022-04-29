<template>
  <ion-page>
    <ion-content>
      <chat-window
          theme="light"
          style="height: 100%!important;"
          class="w-full"
          :styles="styles"
          :current-user-id="userCredentials.id"
          :room-id="roomId"
          :rooms="loadedRooms"
          :loading-rooms="loadingRooms"
          :messages="messages"
          :messages-loaded="messagesLoaded"
          :rooms-loaded="roomsLoaded"
          :room-actions="roomActions"
          :menu-actions="menuActions"
          :room-message="roomMessage"
          :templates-text="templatesText"
          @fetch-more-rooms="fetchMoreRooms"
          @fetch-messages="fetchMessages"
          @send-message="sendMessage"
          @edit-message="editMessage"
          @delete-message="deleteMessage"
          @open-file="openFile"
          @open-user-tag="openUserTag"
          @add-room="modal = true"
          @room-info="log($event)"
          @room-action-handler="menuActionHandler"
          @menu-action-handler="menuActionHandler"
          @send-message-reaction="sendMessageReaction"
          @typing-message="typingMessage"
          @toggle-rooms-list="$emit('show-demo-options', $event.opened)"
      >
        <template v-slot:room-list-avatar="{ room }">
          <ion-avatar class="bg-gray-200 relative avatar_size">
            <firestorage-image profile :path="room.avatar"/>
          </ion-avatar>
        </template>
        <template v-slot:room-header-avatar="{ room }">
          <ion-avatar  class="bg-gray-200 relative avatar_size">
            <firestorage-image profile :path="room.avatar"/>
          </ion-avatar>
        </template>
        <template v-slot:rooms-header>
          <ion-header class="bg-transparent">
            <ion-toolbar class="transparent pl-2 border-b-2 border-primary">
              <ion-buttons slot="primary">
                <ion-button  class="text-primary relative" @click="router.replace('/main')">
                  <ion-icon slot="icon-only"  :icon="close"/>
                </ion-button>
              </ion-buttons>
              <h1 class="text-3xl font-bold text-center">Choose Chat</h1>
            </ion-toolbar>
          </ion-header>
        </template>
      </chat-window>
      <ion-modal :is-open="modal" v-if="modal">
        <add-user-modal class="z-30" @close="modal = false" @added="fetchRooms"/>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import ChatWindow from 'vue-advanced-chat'
import 'vue-advanced-chat/dist/vue-advanced-chat.css'
import * as firestoreService from '../../../services/firebase/firestore'
import * as firebaseService from '../../../services/firebase/database'
import * as storageService from '../../../services/firebase/storage'
import {mapState} from "vuex";
import {close} from "ionicons/icons"
import {formatTimestamp, parseTimestamp} from "@/utils/dates";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonContent,
  modalController,
  useIonRouter,
    IonModal
} from "@ionic/vue";
import addUserModal from "../modals/addUserModal";
import FirestorageImage from "../../../components/storageImage";
import {getDownloadURL} from "firebase/storage";
export default {
  setup(){
    return{
      router:useIonRouter(),
      close
    }
  },
  ionViewDidEnter() {
    this.fetchRooms();
    firebaseService.updateUserOnlineStatus(this.userCredentials.id);
  },
  methods: {
    resetRooms() {
      this.loadingRooms = true;
      this.loadingLastMessageByRoom = 0;
      this.roomsLoadedCount = 0;
      this.rooms = [];
      this.roomsLoaded = true;
      this.startRooms = null;
      this.endRooms = null;
      this.roomsListeners.forEach(listener => listener());
      this.roomsListeners = [];
      this.resetMessages();
    },
    log(x){
      console.log(x)
    },
    resetMessages() {
      this.messages = [];
      this.messagesLoaded = false;
      this.lastLoadedMessage = null;
      this.previousLastLoadedMessage = null;
      this.listeners.forEach(listener => listener());
      this.listeners = [];
    },

    fetchRooms() {
      this.resetRooms();
      this.fetchMoreRooms();
    },

    async fetchMoreRooms() {
      if (this.endRooms && !this.startRooms) {
        this.roomsLoaded = true;
        return;
      }
      const query = firestoreService.roomsQuery(
          this.userCredentials.id,
          this.roomsPerPage,
          this.startRooms
      );

      const rooms = await firestoreService.getRooms(query);
      // this.incrementDbCounter('Fetch Rooms', rooms.size)

      this.roomsLoaded = rooms.empty || rooms.size < this.roomsPerPage;

      if (this.startRooms) this.endRooms = this.startRooms;
      this.startRooms = rooms.docs[rooms.docs.length - 1];

      const roomUserIds = [];
      rooms.forEach(room => {
        room.data().users.forEach(userId => {
          const foundUser = this.allUsers.find(
              user => user && user.id === userId
          );
          if (!foundUser && roomUserIds.indexOf(userId) === -1) {
            roomUserIds.push(userId);
          }
        });
      });
      let users = [];
      // this.incrementDbCounter('Fetch Room Users', roomUserIds.length)
      if (roomUserIds.length >0){
        users = await this.$store.dispatch("api/callApi",{
          name:"requests-user",
          options:{
            func:"friends-get",
            ids:roomUserIds
          }
        })
      }

      // const users = await this.$store.dispatch("user/get", {
      //   users:
      // });
      this.allUsers = [...this.allUsers, ...users].map(x => ({
        ...x,
        username: x.name,
        _id: x.id
      }));
      const roomList = {};
      rooms.forEach(room => {
        roomList[room.id] = { ...room.data(), users: [] };
        room.data().users.forEach(userId => {
          const foundUser = this.allUsers.find(
              user => user && user.id === userId
          );
          if (foundUser) roomList[room.id].users.push(foundUser);
        });
      });
      const formattedRooms = [];

      Object.keys(roomList).forEach(key => {
        const room = roomList[key];

        const roomContacts = room.users.filter(
            user => user.id !== this.userCredentials.id
        );
        room.roomName =
            room.name ||
            roomContacts.map(user => user.name).join(", ") ||
            "Myself";
        console.log(room);
        const roomAvatar =
            room.avatar ||
            (roomContacts.length === 1 && roomContacts[0].profile
                && roomContacts[0].profile);

        formattedRooms.push({
          ...room,
          roomId: key,
          avatar: roomAvatar,
          index: room.lastUpdated.seconds,
          lastMessage: {
            content: "Room created",
            timestamp: formatTimestamp(
                new Date(room.lastUpdated.seconds),
                room.lastUpdated
            )
          }
        });
      });
      this.rooms = this.rooms.concat(formattedRooms);
      formattedRooms.forEach(room => this.listenLastMessage(room));
      if (!this.rooms.length) {
        this.loadingRooms = false;
        this.roomsLoadedCount = 0;
      }

      this.listenUsersOnlineStatus(formattedRooms);
      this.listenRooms(query);
      this.roomsLoaded = true;
      // setTimeout(() => console.log('TOTAL', this.dbRequestCount), 2000)
    },

    listenLastMessage(room) {
      const listener = firestoreService.firestoreListener(
          firestoreService.lastMessageQuery(room.roomId),
          messages => {
            // this.incrementDbCounter('Listen Last Room Message', messages.size)
            messages.forEach(message => {
              const lastMessage = this.formatLastMessage(message.data());
              const roomIndex = this.rooms.findIndex(
                  r => room.roomId === r.roomId
              );
              this.rooms[roomIndex].lastMessage = lastMessage;
              this.rooms = [...this.rooms];
            });
            if (this.loadingLastMessageByRoom < this.rooms.length) {
              this.loadingLastMessageByRoom++;

              if (this.loadingLastMessageByRoom === this.rooms.length) {
                this.loadingRooms = false;
                this.roomsLoadedCount = this.rooms.length;
              }
            }
          }
      );

      this.roomsListeners.push(listener);
    },

    formatLastMessage(message) {
      if (!message.timestamp) return;

      let content = message.content;
      if (message.files && message.files.length) {
        const file = message.files[0];
        content = `${file.name}.${file.extension || file.type}`;
      }

      return {
        ...message,
        ...{
          content,
          timestamp: formatTimestamp(
              new Date(message.timestamp.seconds * 1000),
              message.timestamp
          ),
          distributed: true,
          seen:
              message.sender_id === this.userCredentials.id ? message.seen : null,
          new:
              message.sender_id !== this.userCredentials.id &&
              (!message.seen || !message.seen[this.userCredentials.id])
        }
      };
    },

    fetchMessages({ room, options = {} }) {
      this.$emit("show-demo-options", false);

      if (options.reset) {
        this.resetMessages();
        this.roomId = room.roomId;
      }

      if (this.previousLastLoadedMessage && !this.lastLoadedMessage) {
        this.messagesLoaded = true;
        return;
      }

      this.selectedRoom = room.roomId;

      firestoreService
          .getMessages(room.roomId, this.messagesPerPage, this.lastLoadedMessage)
          .then(messages => {
            // this.incrementDbCounter('Fetch Room Messages', messages.size)
            if (this.selectedRoom !== room.roomId) return;

            if (messages.empty || messages.docs.length < this.messagesPerPage) {
              setTimeout(() => (this.messagesLoaded = true), 0);
            }

            if (options.reset) this.messages = [];

            messages.forEach(message => {
              const formattedMessage = this.formatMessage(room, message);
              this.messages.unshift(formattedMessage);
            });

            if (this.lastLoadedMessage) {
              this.previousLastLoadedMessage = this.lastLoadedMessage;
            }
            this.lastLoadedMessage = messages.docs[messages.docs.length - 1];

            const listener = firestoreService.firestoreListener(
                firestoreService.paginatedMessagesQuery(
                    room.roomId,
                    this.lastLoadedMessage,
                    this.previousLastLoadedMessage
                ),
                snapshots => {
                  // this.incrementDbCounter('Listen Room Messages', snapshots.size)
                  this.listenMessages(snapshots, room);
                }
            );
            this.listeners.push(listener);
          });
    },

    listenMessages(messages, room) {
      messages.forEach(message => {
        const formattedMessage = this.formatMessage(room, message);
        const messageIndex = this.messages.findIndex(m => m._id === message.id);

        if (messageIndex === -1) {
          this.messages = this.messages.concat([formattedMessage]);
        } else {
          this.messages[messageIndex] = formattedMessage;
          this.messages = [...this.messages];
        }

        this.markMessagesSeen(room, message);
      });
    },

    markMessagesSeen(room, message) {
      if (
          message.data().sender_id !== this.userCredentials.id &&
          (!message.data().seen || !message.data().seen[this.userCredentials.id])
      ) {
        firestoreService.updateMessage(room.roomId, message.id, {
          [`seen.${this.userCredentials.id}`]: new Date()
        });
      }
    },

    formatMessage(room, message) {
      const senderUser = room.users.find(
          user => message.data().sender_id === user.id
      );

      const { timestamp } = message.data();

      const formattedMessage = {
        ...message.data(),
        ...{
          senderId: message.data().sender_id,
          _id: message.id,
          seconds: timestamp.seconds,
          timestamp: parseTimestamp(timestamp, "HH:mm"),
          date: parseTimestamp(timestamp, "DD MMMM YYYY"),
          t: timestamp.toDate(),
          profile: senderUser ? senderUser.profile : null,
          name: senderUser ? senderUser.name : null,
          // avatar: senderUser ? senderUser.avatar : null,
          distributed: true
        }
      };

      if (message.data().replyMessage) {
        formattedMessage.replyMessage = {
          ...message.data().replyMessage,
          ...{
            senderId: message.data().replyMessage.sender_id
          }
        };
      }

      return formattedMessage;
    },

    async sendMessage({ content, roomId, files, replyMessage }) {
      const message = {
        sender_id: this.userCredentials.id,
        content,
        timestamp: new Date()
      };

      if (files) {
        message.files = this.formattedFiles(files);
      }

      if (replyMessage) {
        message.replyMessage = {
          _id: replyMessage._id,
          content: replyMessage.content,
          sender_id: replyMessage.senderId
        };

        if (replyMessage.files) {
          message.replyMessage.files = replyMessage.files;
        }
      }

      const { id } = await firestoreService.addMessage(roomId, message);

      if (files) {
        for (let index = 0; index < files.length; index++) {
          await this.uploadFile({ file: files[index], messageId: id, roomId });
        }
      }

      firestoreService.updateRoom(roomId, { lastUpdated: new Date() });
    },

    async editMessage({ messageId, newContent, roomId, files }) {
      const newMessage = { edited: new Date() };
      newMessage.content = newContent;

      if (files) {
        newMessage.files = this.formattedFiles(files);
      } else {
        newMessage.files = firestoreService.deleteDbField;
      }

      await firestoreService.updateMessage(roomId, messageId, newMessage);

      if (files) {
        for (let index = 0; index < files.length; index++) {
          if (files[index] && files[index].blob) {
            await this.uploadFile({ file: files[index], messageId, roomId });
          }
        }
      }
    },

    async deleteMessage({ message, roomId }) {
      await firestoreService.updateMessage(roomId, message._id, {
        deleted: new Date()
      });

      const { files } = message;

      if (files) {
        files.forEach(file => {
          storageService.deleteFile(this.userCredentials.id, message._id, file);
        });
      }
    },

    async uploadFile({ file, messageId, roomId }) {
      let type = file.extension || file.type;
      if (type === "svg" || type === "pdf") {
        type = file.type;
      }

      const uploadTask = storageService.uploadFileTask(
          this.userCredentials.id,
          messageId,
          file,
          type
      );

      uploadTask.on(
          "state_changed",
          snap => {
            const progress = Math.round(
                (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.updateFileProgress(messageId, file.localUrl, progress);
          },
          _error => this.$store.commit("toast/error", _error),
          async () => {
            const url = await getDownloadURL(
                uploadTask.snapshot.ref
            );
            const messageDoc = await firestoreService.getMessage(
                roomId,
                messageId
            );

            const files = messageDoc.data().files;

            files.forEach(f => {
              if (f.url === file.localUrl) {
                f.url = url;
              }
            });

            firestoreService.updateMessage(roomId, messageId, { files });
          }
      );
    },

    updateFileProgress(messageId, fileUrl, progress) {
      const message = this.messages.find(message => message._id === messageId);

      if (!message || !message.files) return;

      message.files.find(file => file.url === fileUrl).progress = progress;
      this.messages = [...this.messages];
    },

    formattedFiles(files) {
      const formattedFiles = [];

      files.forEach(file => {
        const messageFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          extension: file.extension || file.type,
          url: file.url || file.localUrl
        };

        if (file.audio) {
          messageFile.audio = true;
          messageFile.duration = file.duration;
        }

        formattedFiles.push(messageFile);
      });

      return formattedFiles;
    },

    openFile({ file }) {
      window.open(file.file.url, "_blank");
    },

    async openUserTag({ user }) {
      let roomId;

      this.rooms.forEach(room => {
        if (room.users.length === 2) {
          const userId1 = room.users[0].id;
          const userId2 = room.users[1].id;
          if (
              (userId1 === user.id || userId1 === this.userCredentials.id) &&
              (userId2 === user.id || userId2 === this.userCredentials.id)
          ) {
            roomId = room.roomId;
          }
        }
      });

      if (roomId) {
        this.roomId = roomId;
        return;
      }

      const query1 = await firestoreService.getUserRooms(
          this.userCredentials.id,
          user.id
      );

      if (!query1.empty) {
        return this.loadRoom(query1);
      }

      const query2 = await firestoreService.getUserRooms(
          user.id,
          this.userCredentials.id
      );

      if (!query2.empty) {
        return this.loadRoom(query2);
      }

      const room = await firestoreService.addRoom({
        users: [user.id, this.userCredentials.id],
        lastUpdated: new Date()
      });

      this.roomId = room.id;
      this.fetchRooms();
    },

    async loadRoom(query) {
      for (const room of query) {
        if (this.loadingRooms) continue;
        await firestoreService.updateRoom(room.id, { lastUpdated: new Date() });
        this.roomId = room.id;
        this.fetchRooms();
      }
    },

    menuActionHandler({ action, roomId }) {
      switch (action.name) {
        case "inviteUser":
          return this.inviteUser(roomId);
        case "removeUser":
          return this.removeUser(roomId);
        case "deleteRoom":
          return this.deleteRoom(roomId);
      }
    },

    async sendMessageReaction({ reaction, remove, messageId, roomId }) {
      firestoreService.updateMessageReactions(
          roomId,
          messageId,
          this.userCredentials.id,
          reaction.unicode,
          remove ? "remove" : "add"
      );
    },

    typingMessage({ message, roomId }) {
      if (roomId) {
        if (message && message.length > 1) {
          this.typingMessageCache = message;
          return;
        }

        if (message && message.length === 1 && this.typingMessageCache) {
          this.typingMessageCache = message;
          return;
        }

        this.typingMessageCache = message;

        firestoreService.updateRoomTypingUsers(
            roomId,
            this.userCredentials.id,
            message ? "add" : "remove"
        );
      }
    },

    async listenRooms(query) {
      const listener = firestoreService.firestoreListener(query, rooms => {
        // this.incrementDbCounter('Listen Rooms Typing Users', rooms.size)
        rooms.forEach(room => {
          const foundRoom = this.rooms.find(r => r.roomId === room.id);
          if (foundRoom) {
            foundRoom.typingUsers = room.data().typingUsers;
            foundRoom.index = room.data().lastUpdated.seconds;
          }
        });
      });
      this.roomsListeners.push(listener);
    },

    listenUsersOnlineStatus(rooms) {
      rooms.forEach(room => {
        room.users.forEach(user => {
          const listener = firebaseService.firebaseListener(
              firebaseService.userStatusRef(user.id),
              snapshot => {
                if (!snapshot || !snapshot.val()) return;

                const lastChanged = formatTimestamp(
                    new Date(snapshot.val().lastChanged),
                    new Date(snapshot.val().lastChanged)
                );

                user.status = { ...snapshot.val(), lastChanged };

                const roomIndex = this.rooms.findIndex(
                    r => room.roomId === r.roomId
                );

                this.rooms[roomIndex] = room;
                this.rooms = [...this.rooms];
              }
          );
          this.roomsListeners.push(listener);
        });
      });
    },

    async addRoom() {
      const modal = await modalController
          .create({
            id:"add-chat",
            component: addUserModal,
            backdropDismiss:false,
            parent:this
          });
      modal.onDidDismiss(() => {
        // This will be executed after the modal is dismissed...
        console.log("dismissed")
        this.fetchRooms();
      });
      await modal.present();
    },
    inviteUser(roomId) {
      this.resetForms();
      this.inviteRoomId = roomId;
    },
    removeUser(roomId) {
      this.resetForms();
      this.removeRoomId = roomId;
      this.removeUsers = this.rooms.find(room => room.roomId === roomId).users;
    },

    async deleteRoomUser() {
      this.disableForm = true;

      await firestoreService.removeRoomUser(
          this.removeRoomId,
          this.removeUserId
      );

      this.removeRoomId = null;
      this.removeUserId = "";
      this.fetchRooms();
    },

    async deleteRoom(roomId) {
      firestoreService.getMessages(roomId).then(messages => {
        messages.forEach(message => {
          firestoreService.deleteMessage(roomId, message.id);
          if (message.data().files) {
            message.data().files.forEach(file => {
              storageService.deleteFile(
                  this.userCredentials.id,
                  message.id,
                  file
              );
            });
          }
        });
      });
      await firestoreService.deleteRoom(roomId);
      this.fetchRooms();
    },

    resetForms() {
      this.disableForm = false;
      this.addNewRoom = null;
      this.addRoomUsername = "";
      this.inviteRoomId = null;
      this.invitedUsername = "";
      this.removeRoomId = null;
      this.removeUserId = "";
    },
    getUser(x) {
      return this.allUsers[this.allUsers.findIndex(s => (s._id = x))];
    }

    // ,incrementDbCounter(type, size) {
    // 	size = size || 1
    // 	this.dbRequestCount += size
    // 	console.log(type, size)
    // }
  },
  data() {
    return {
      roomsPerPage: 15,
      rooms: [],
      roomId: "",
      startRooms: null,
      endRooms: null,
      roomsLoaded: false,
      loadingRooms: true,
      allUsers: [],
      loadingLastMessageByRoom: 0,
      roomsLoadedCount: false,
      selectedRoom: null,
      messagesPerPage: 20,
      messages: [],
      messagesLoaded: false,
      roomMessage: "",
      lastLoadedMessage: null,
      previousLastLoadedMessage: null,
      roomsListeners: [],
      listeners: [],
      typingMessageCache: "",
      roomActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" }
      ],
      menuActions: [
        { name: "inviteUser", title: "Invite User" },
        { name: "removeUser", title: "Remove User" },
        { name: "deleteRoom", title: "Delete Room" }
      ],
      styles: { container: { borderRadius: "4px" } },
      modal:false,
      templatesText: [
        {
          tag: "help",
          text: "This is the help"
        },
        {
          tag: "action",
          text: "This is the action"
        },
        {
          tag: "action 2",
          text: "This is the second action"
        }
      ]
      // ,dbRequestCount: 0
    };
  },
  computed: {
    loadedRooms() {
      return this.rooms.slice(0, this.roomsLoadedCount);
    },
    ...mapState({userCredentials:state => state.user})
  },
  name: "chats_handler",
  components:{
    IonAvatar,IonModal,
    FirestorageImage,
    addUserModal,
    ChatWindow,
    IonPage,IonContent
    ,IonIcon,
    IonHeader,IonToolbar,IonButtons,IonButton
  },
}
</script>

<style scoped lang="scss">
.avatar_size{
  width:45px;
  height:45px;
  position: relative;
  overflow: hidden;
  img{
    position: absolute;
  }
}
</style>
