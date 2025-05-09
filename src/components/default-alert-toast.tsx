import React from "react";
import {
  Snackbar,
  Button,
  IconButton,
  SnackbarCloseReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface DefaultAlertToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  autoHideDuration?: number;
  message: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

const DefaultAlertToast: React.FC<DefaultAlertToastProps> = ({
  open,
  setOpen,
  autoHideDuration = 6000,
  message,
  actionLabel,
  onActionClick,
}) => {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      {actionLabel && onActionClick && (
        <Button color="secondary" size="small" onClick={onActionClick}>
          {actionLabel}
        </Button>
      )}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      message={message}
      action={action}
    />
  );
};

export default DefaultAlertToast;
