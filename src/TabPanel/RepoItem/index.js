import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  Link,
  Typography,
  Button,
  Tooltip,
} from "@material-ui/core";
import { GitHub, Star, CallSplit } from "@material-ui/icons";

function RepoItem(props) {
  const { repo } = props;
  const {
    full_name,
    id,
    description,
    stargazers_count,
    forks_count,
    html_url,
    owner: { avatar_url, login },
  } = repo;
  return (
    <React.Fragment key={id}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={login} src={avatar_url} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex">
              <Box
                display="flex"
                mr={3}
                alignItems="center"
                justifyContent="center"
              >
                <Link href={html_url} color="inherit">
                  {full_name}
                </Link>
              </Box>

              <Box display="flex" mx={1}>
                <Tooltip title="Stars" arrow>
                  <span>
                    <Button disabled size="small" endIcon={<Star />}>
                      {stargazers_count}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
              <Box display="flex" mx={1}>
                <Tooltip title="Forks" arrow>
                  <span>
                    <Button disabled size="small" endIcon={<CallSplit />}>
                      {forks_count}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          }
          secondary={description}
        />
        <ListItemSecondaryAction>
          <Link href={html_url} component="button" variant="body2">
            <Box display="flex" alignItems="center">
              <Box mr={1}>
                <GitHub />
              </Box>
              <Typography variant="caption">Check repo</Typography>
            </Box>
          </Link>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
}

RepoItem.propTypes = {
  repo: PropTypes.object.isRequired,
};

export default RepoItem;
