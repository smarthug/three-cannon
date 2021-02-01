import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up("sm")]: {
            minWidth: "344px !important",
        },
    },
    card: {
        backgroundColor: theme.palette.custom.grey[4],
        border: `2px solid ${theme.palette.custom.grey[4]}`,
        width: "100%",
        "& #default": {
            borderLeft: `3px solid ${theme.palette.custom.grey[3]}`,
        },
        "& #warning": {
            borderLeft: `3px solid #ff9800`,
        },
        "& #error": {
            borderLeft: `3px solid #d32f2f`,
        },
        "& #info": {
            borderLeft: `3px solid #2196f3`,
        },
        "& #success": {
            borderLeft: `3px solid #43a047`,
        },
    },
    typography: {
        overflow: "hidden",
        fontWeight: "bold",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
    },
    actionRoot: {
        padding: "0px 0px 0px 16px",
        justifyContent: "space-between",
        height: 40,
    },
    expand: {
        padding: "7px 7px",
        transform: "rotate(0deg)",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: "#b3b3b3",
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: "none",
    },
}));

export function SnackMessageBox({
    id,
    message,
    variant,
    onDismiss,
    children = null,
}) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card className={classes.card} square>
            <CardActions id={variant} classes={{ root: classes.actionRoot }}>
                <Typography variant="subtitle2" className={classes.typography}>
                    {message}
                </Typography>
                <div>
                    {children ? (
                        <IconButton
                            size="small"
                            aria-label="Show more"
                            className={classnames(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}>
                            <ExpandMoreIcon fontSize="inherit" />
                        </IconButton>
                    ) : (
                        <React.Fragment />
                    )}
                    <IconButton
                        size="small"
                        className={classes.expand}
                        onClick={onDismiss}>
                        <CloseIcon edge fontSize="inherit" />
                    </IconButton>
                </div>
            </CardActions>
            {children ? (
                <Collapse
                    in={expanded}
                    timeout="auto"
                    mountOnEnter
                    unmountOnExit>
                    <Paper className={classes.collapse}>{children}</Paper>
                </Collapse>
            ) : (
                <React.Fragment />
            )}
        </Card>
    );
}

const SnackMessage = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const isDismiss = useRef(false);
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDismiss = () => {
        isDismiss.current = true;
        closeSnackbar(props.id);
    };

    useEffect(() => {
        return () => {
            !isDismiss.current && props.onStack();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card} square>
                <CardActions
                    id={props.variant}
                    classes={{ root: classes.actionRoot }}>
                    <Typography
                        variant="subtitle2"
                        className={classes.typography}>
                        {props.message}
                    </Typography>
                    <div className={classes.icons}>
                        {props.children ? (
                            <IconButton
                                size="small"
                                aria-label="Show more"
                                className={classnames(classes.expand, {
                                    [classes.expandOpen]: expanded,
                                })}
                                onClick={handleExpandClick}>
                                <ExpandMoreIcon fontSize="small" />
                            </IconButton>
                        ) : (
                            <React.Fragment />
                        )}
                        <IconButton
                            size="small"
                            className={classes.expand}
                            onClick={handleDismiss}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                </CardActions>
                {props.children ? (
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Paper className={classes.collapse}>
                            {React.cloneElement(props.children, {
                                handleOnClose: handleDismiss,
                            })}
                        </Paper>
                    </Collapse>
                ) : (
                    <React.Fragment />
                )}
            </Card>
        </SnackbarContent>
    );
});

export default SnackMessage;
