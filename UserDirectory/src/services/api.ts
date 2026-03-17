import axios from "axios";

export const api = axios.create({
    baseURL:"https://jsonplaceholder.typicode.com"
})

export type User = {
    id: number;
    name: string;
    email : string;
    company :{name:string}
}

export type Post = {
    id:number;
    title: string;
    userId: number;
}

export const getUsers = async (): Promise<User[]> =>{
    const res = await api.get<User[]>("/users") 
    return res.data
}

export const getPostsForUser = async (userId: number): Promise<Post[]> => { 
    const res = await api.get<Post[]>(`/posts?userId=${userId}`)
    return res.data;
 }
