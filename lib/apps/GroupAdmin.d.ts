/**
 * 全体禁言
 */
export declare const muteAll: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
/**
 * 设置/取消管理员
 */
export declare const setAdmin: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
/**
 * 设置群头衔
 */
export declare const ApplyGroupTitle: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
/**
 * 设置头衔
 */
export declare const setGroupTitle: import("node-karin").Command<"message.group">;
/**
 * 踢人
 */
export declare const kickMember: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
/**
 * 解禁
 */
export declare const UnBanMember: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
export declare const BanMember: import("node-karin").Command<keyof import("node-karin").MessageEventMap>;
