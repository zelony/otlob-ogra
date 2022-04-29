import "sweetalert2/src/sweetalert2.scss";
const Swal = require("sweetalert2");
// import * as Sentry from "@sentry/capacitor"
export default {
    namespaced: true,
    mutations: {
        success() {
            // Swal.fire({
            //     icon: "success",
            //     title: "Success",
            //     text: text
            // });

        },
        info(stat, { title, message }) {
            console.log(stat,title,message);
            // Swal.fire(title, message, "info");
        },
        comingSoon() {
            // Swal.fire({
            //     title: "Coming soon",
            //     text:"This version is demo",
            //     icon: "info"
            // });
        },
        internetNeeded() {
            // Swal.fire({
            //     title: "Internet needed",
            //     text:"You must connect to internet",
            //     icon: "info"
            // });
        },
        error(stat, error) {
            console.trace(error);
            if (typeof error.error === typeof {} && error.error) {
                error = error.error;
            }
            // Sentry.captureException(error);
            // CrachyliticsRecordException(error.code,error.message)

            Swal.fire({
                icon: "error",
                title:"Error:" + error.code,
                text:error.message
            });
        }
    }
};
