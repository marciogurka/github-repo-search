import { useState } from "react";
import { Box, Paper, Tabs, Tab, Typography, Link } from "@material-ui/core";
import TabPanel from "./TabPanel";

const availablesLanguages = [
  {
    label: "JavaScript",
    searchKey: "javascript",
  },
  {
    label: "Java",
    searchKey: "java",
  },
  {
    label: "Python",
    searchKey: "python",
  },
  {
    label: "CSS",
    searchKey: "css",
  },
  {
    label: "PHP",
    searchKey: "php",
  },
  {
    label: "Ruby",
    searchKey: "ruby",
  },
  {
    label: "C++",
    searchKey: "c++",
  },
  {
    label: "C",
    searchKey: "c",
  },
  {
    label: "Shell",
    searchKey: "shell",
  },
  {
    label: "C#",
    searchKey: "c#",
  },
  {
    label: "Objective-C",
    searchKey: "objective-c",
  },
  {
    label: "R",
    searchKey: "r",
  },
  {
    label: "VimL",
    searchKey: "viml",
  },
  {
    label: "Go",
    searchKey: "go",
  },
  {
    label: "Perl",
    searchKey: "perl",
  },
];

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box display="flex" flexDirection="column" p={2}>
      <Typography variant="h4" component="h1" gutterBottom>
        GitHub Repo Search
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        React component that allows searching into the Github API for some repo
        of a language availables. The search is doing while you typing, or you
        can click the search button as well.
      </Typography>
      <Typography variant="body1" component="p" gutterBottom>
        The languages were chosen based on the most repos quantity found{" "}
        <Link href="https://githut.info">here</Link>.
      </Typography>
      <Typography variant="caption" component="p" gutterBottom>
        Made with ❤️ by:
        <Link href="http://github.com/marciogurka" color="inherit">
          @marciogurka
        </Link>
      </Typography>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
        >
          {availablesLanguages.map((language) => (
            <Tab label={language.label} key={language.label} />
          ))}
        </Tabs>
        {availablesLanguages.map((language, i) => (
          <TabPanel
            value={value}
            index={i}
            language={language}
            key={language.searchKey}
          />
        ))}
      </Paper>
    </Box>
  );
}

export default App;
