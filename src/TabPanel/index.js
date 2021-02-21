import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  List,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Button,
  ListItemText,
  ListItem,
} from "@material-ui/core";
import { AlertTitle } from "@material-ui/lab";
import { Search } from "@material-ui/icons";
import axios from "axios";
import RepoItem from "./RepoItem";
import { FullWidthAlert } from "./styles";

function TabPanel(props) {
  const { children, value, index, language, ...other } = props;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [results, setResults] = useState([]);

  const loadData = useCallback(
    (page, searchText) => {
      setResults([]);
      if (searchText) {
        setHasError(false);
        setLoading(true);
        const url = `https://api.github.com/search/repositories?q=${searchText}+language:${language.searchKey}`;
        axios
          .get(url, {
            params: {
              per_page: 100,
              page: page,
              sort: "stars",
              order: "desc",
            },
          })
          .then(({ data }) => {
            const { items } = data;
            setResults(items);
          })
          .catch((error) => {
            setHasError(true);
            console.error(error);
          })
          .then(() => {
            setLoading(false);
          });
      }
    },
    [language]
  );

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  useEffect(() => {
    loadData(page, search);
  }, [page]);

  useEffect(() => {
    return () => {
      setPage(1);
      setResults([]);
    };
  }, [language]);

  const handleChange = debounce((event) => {
    setHasError(false);
    setSearch(event.target.value);
    loadData(1, event.target.value);
  }, 300);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <OutlinedInput
            type="text"
            disabled={loading}
            fullWidth
            placeholder="Repository name"
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="do search"
                  onClick={(ev) => loadData(1, search)}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
          {loading && !hasError && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              my={2}
            >
              <Box mr={2}>
                <CircularProgress />
              </Box>
              <Typography variant="body1">Loading...</Typography>
            </Box>
          )}
          {hasError && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              my={2}
            >
              <FullWidthAlert
                severity="error"
                action={
                  <Button color="inherit" size="small">
                    Redo Search
                  </Button>
                }
              >
                <AlertTitle>Ops! Something went wrong</AlertTitle>
                Please try again to search or reload the page!
              </FullWidthAlert>
            </Box>
          )}
          {!loading && !hasError && (
            <List>
              {results.length > 0 &&
                results.map((repoData) => {
                  const { id } = repoData;
                  return <RepoItem key={id} repo={repoData} />;
                })}
              {!results.length && search !== "" && (
                <ListItem>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography color="error">{`No repository found for '${search}' in ${language.label}`}</Typography>
                    }
                  />
                </ListItem>
              )}
              {search === "" && (
                <ListItem>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography variant="caption">
                        Write something in the search box to start finding
                        awesome repos
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          )}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
