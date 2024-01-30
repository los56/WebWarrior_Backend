export default interface Post {
    id: number;
    title: string;
    contents: string;
    create_date: string;
    modify_date?: string;
    writer: number;

    nickname?: string; // for display
}