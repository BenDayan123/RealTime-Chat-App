export enum Events {
  // friendship events:
  NEW_FRIEND_REQUEST = "new_friend_request",
  FRIEND_STATUS_CHANGED = "friend_status_changed",

  //user events:
  USER_TYPING = "client-typing",
  USER_RECORDING = "client-record",
  USER_STOP_RECORDING = "client-stop-record",
  USER_STOP_TYPING = "client-stop_typing",

  //message events:
  NEW_CHANNEL_MESSAGE = "new_channel_message",
  MESSAGE_SEEN = "client-message_seen",
  MESSAGES_DELETED = "messages_deleted",
  REACTION_ADDED = "reaction_added",
  REACTION_REMOVED = "reaction_removed",

  //group events:
  NEW_GROUP_CREATED = "new_group",
  GROUP_EDITED = "group_edited",
  MEMBER_ADDED = "member_added",
  MEMBERS_REMOVED = "members_removed",
  MEMBER_LEAVED = "member_leaved",
}
