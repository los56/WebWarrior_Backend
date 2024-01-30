export default interface User {
    id: number;
    username: string;
    password: string;
    nickname: string;
    email: string;
    create_date: string;
    password_change_date: string;
    last_login?: string;
}
