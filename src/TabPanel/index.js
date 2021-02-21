import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
  Button,
  ListItemText,
  ListItem,
} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroll-component";
import { AlertTitle } from "@material-ui/lab";
import { Search } from "@material-ui/icons";
import axios from "axios";
import RepoItem from "./RepoItem";
import { FullWidthAlert, CustomList } from "./styles";

function TabPanel(props) {
  const { children, value, index, language, ...other } = props;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [results, setResults] = useState([]);

  const loadData = useCallback(
    (page, searchText, clearResults) => {
      if (searchText) {
        setHasError(false);
        setLoading(true);
        const url = `https://api.github.com/search/repositories?q=${searchText}+language:${language.searchKey}`;
        axios
          .get(url, {
            params: {
              per_page: 10,
              page: page,
              sort: "stars",
              order: "desc",
            },
          })
          .then(({ data }) => {
            const { items } = data;
            const updatedResults = clearResults
              ? items
              : [...results, ...items];
            setResults(updatedResults);
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
    [language.searchKey, results]
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
    loadData(page, search, false);
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
    loadData(1, event.target.value, true);
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
                  onClick={(ev) => loadData(1, search, true)}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
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
          {!hasError && (
            <CustomList id="scrollableList">
              {results.length > 0 && (
                <InfiniteScroll
                  dataLength={results.length}
                  next={() => setPage(page + 1)}
                  hasMore={true}
                  scrollableTarget="scrollableList"
                >
                  {results.map((repoData) => {
                    const { id } = repoData;
                    return <RepoItem key={id} repo={repoData} />;
                  })}
                </InfiniteScroll>
              )}
              {!results.length && search !== "" && !loading && (
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
            </CustomList>
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
