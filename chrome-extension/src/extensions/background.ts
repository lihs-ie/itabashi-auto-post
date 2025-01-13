import { createBatch } from "aspects/alarms";
import { createListener, initiate } from "aspects/runtime";
import { authenticate, checkLogin, postTweet } from "aspects/x";

initiate({ callback: authenticate }, { callback: checkLogin });

createBatch("checkLogin", 0.1, checkLogin);

createListener("postTweet", postTweet);

createListener("startAuthFlow", authenticate);
