import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    role: Role;
    timestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum Role {
    user = "user",
    assistant = "assistant"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(sessionName: string, role: Role, content: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearExpiredMessages(): Promise<void>;
    createSession(name: string): Promise<void>;
    deleteSession(name: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(sessionName: string): Promise<Array<Message>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listSessions(): Promise<Array<string>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    upgradeSessions(): Promise<void>;
}
