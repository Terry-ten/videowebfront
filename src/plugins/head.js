import router from "@/router"

const headjump = {
    methods: {
      editProfile() {
        router.push("/myinfo");
      },
      myCreation() {
        router.push("/myvideos");
      },
      logout() {
        router.push("/login");
        localStorage.removeItem("token");
       localStorage.removeItem("userdata");
      },
    },
  };
  
  export default headjump;