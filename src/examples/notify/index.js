import React from "react";
import { List } from "immutable";
// notify msg template
import DefaultMsg from "./MessageType/plain";
import { notifyAPI } from "./MessageType";
import { Typography } from "@material-ui/core";

export const stackNotify = React.createRef();

export function enqueue({
    message = "",
    variant = "default",
    options = { stack: false, extendChild: null, persist: false },
}) {
    let { stack = false, extendChild = null, persist = false } = options;
    const key = new Date().getTime() + Math.random();

    if (extendChild?.constructor === String) {
        extendChild = <Typography variant="caption">{extendChild}</Typography>;
    }

    function stackNotifyMsg() {
        if (stack || !persist)
            stackNotify.current =
                stackNotify.current?.size >= 20
                    ? stackNotify.current
                          ?.push({
                              key,
                              message,
                              variant,
                              extendChild,
                          })
                          .shift()
                    : stackNotify.current?.push({
                          key,
                          message,
                          variant,
                          extendChild,
                      }) || List([{ key, message, variant, extendChild }]);
    }

    return notifyAPI.current.enqueueSnackbar(message, {
        key,
        content: (key, message) => (
            <DefaultMsg
                id={key}
                message={message}
                variant={variant}
                onStack={stackNotifyMsg}>
                {extendChild}
            </DefaultMsg>
        ),
        persist,
    });
}

export function close(key) {
    key
        ? notifyAPI.current.closeSnackbar(key)
        : notifyAPI.current.closeSnackbar();
}
