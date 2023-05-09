import { jwtUtils } from './jwtUtils';

export function checkvalid(){
    const token = localStorage.getItem('token');
    if (token) {
        // 解析令牌并获取角色类型
        const payload = jwtUtils.parseJwt(token);
        const userRoleType = payload.type;
        // 根据角色类型判断用户是否有权访问特定页面
        if (!(userRoleType === 2||userRoleType === 3)){
         this.$router.push("/login")
        }
      }
}


export function checkrootvalid(){
    const token = localStorage.getItem('token');
    if (token) {
        const payload = jwtUtils.parseJwt(token);
        const userRoleType = payload.type;
        if (!(userRoleType === 3)){
          this.$router.push("/login")
        }
      }
}