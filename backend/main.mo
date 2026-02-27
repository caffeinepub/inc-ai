import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type Role = { #user; #assistant };

  type Message = {
    role : Role;
    content : Text;
    timestamp : Time.Time;
  };

  type ChatSession = {
    name : Text;
    messages : List.List<Message>;
    isExpired : Bool;
  };

  type UserProfile = {
    name : Text;
  };

  let sessions = Map.empty<Principal, Map.Map<Text, ChatSession>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // ── User profile functions (required by frontend) ──────────────────────────

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Chat session functions ─────────────────────────────────────────────────

  public query ({ caller }) func listSessions() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can list sessions");
    };
    let userSessions = switch (sessions.get(caller)) {
      case (?s) { s };
      case (null) { Map.empty<Text, ChatSession>() };
    };
    userSessions.keys().toArray();
  };

  public query ({ caller }) func getMessages(sessionName : Text) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get messages");
    };
    let userSessions = switch (sessions.get(caller)) {
      case (?s) { s };
      case (null) { Runtime.trap("No sessions found for this user") };
    };
    let session = switch (userSessions.get(sessionName)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };
    session.messages.toArray();
  };

  public shared ({ caller }) func createSession(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };
    let userSessions = switch (sessions.get(caller)) {
      case (?s) { s };
      case (null) { Map.empty<Text, ChatSession>() };
    };

    if (userSessions.containsKey(name)) {
      Runtime.trap("Session already exists");
    };

    let newSession : ChatSession = {
      name;
      messages = List.empty<Message>();
      isExpired = false;
    };

    userSessions.add(name, newSession);
    sessions.add(caller, userSessions);
  };

  public shared ({ caller }) func addMessage(sessionName : Text, role : Role, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };
    let userSessions = switch (sessions.get(caller)) {
      case (?s) { s };
      case (null) { Runtime.trap("No sessions found for this user") };
    };

    let session = switch (userSessions.get(sessionName)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    let message : Message = {
      role;
      content;
      timestamp = Time.now();
    };

    session.messages.add(message);
  };

  public shared ({ caller }) func deleteSession(name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };
    let userSessions = switch (sessions.get(caller)) {
      case (?s) { s };
      case (null) { Runtime.trap("No sessions found for this user") };
    };

    let session = switch (userSessions.get(name)) {
      case (?s) { s };
      case (null) { Runtime.trap("Session not found") };
    };

    if (session.isExpired) {
      Runtime.trap("Session already expired");
    };

    let expiredSession : ChatSession = { session with isExpired = true };
    userSessions.add(name, expiredSession);
  };

  // ── Admin-only maintenance functions ──────────────────────────────────────

  public shared ({ caller }) func clearExpiredMessages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear expired messages");
    };
    for ((user, userSessions) in sessions.entries()) {
      for ((name, session) in userSessions.entries()) {
        if (session.isExpired) {
          let activeSessions = userSessions.filter(
            func(n : Text, s : ChatSession) : Bool {
              not s.isExpired;
            }
          );
          sessions.add(user, activeSessions);
        };
      };
    };
  };

  public shared ({ caller }) func upgradeSessions() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can upgrade sessions");
    };
    for ((user, userSessions) in sessions.entries()) {
      let upgradableSessions = userSessions.filter(
        func(n : Text, s : ChatSession) : Bool {
          not s.isExpired;
        }
      );
      sessions.add(user, upgradableSessions);
    };
  };
};
