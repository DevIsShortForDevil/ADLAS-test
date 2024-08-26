import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {
  Autocomplete,
  Box,
  Button,
  createFilterOptions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  SvgIcon,
  SvgIconTypeMap,
  TextField,
} from "@mui/material";
import {
  School,
  Science,
  TheaterComedy,
  SportsSoccer,
  SportsEsports,
} from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

// Adding this here instead of a separate readme file just so it will be seen.
// What was asked in the task was basically a styled datalist tag.
// Since datalist tags can't be styled by default, you have a couple of options.
// The cheaper option is using something like datalist-css => link: https://github.com/craigbuckler/datalist-css
// But this option has many flaws and shortcomings.
// Usually in any project you would use a component package (MUI, Vuetify, etc)
// And these packages solve this problem elegantly and I could do more with them.
// So I chose the latter.
// The following is a short example of implementing a datalist using the AutoComplete component with MUI.
// Also added a dialog to fill in the entire object data for the user-added option.

const filter = createFilterOptions<Opt>();

function App() {
  const [value, setValue] = useState<Opt | null>(null);
  const [dialogValue, setDialogValue] = useState<Opt>({ val: "", title: "" });
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    setDialogValue({
      val: "",
      title: "",
    });
    toggleOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // You can Add your verification logic here...

    setValue({
      val: dialogValue.val,
      title: dialogValue.title,
    });
    handleClose();

    // Any extra logic (API calls, etc) goes here.
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h2>ADLAS datalist/Autocomplete test</h2>
      <div className="card">
        <Autocomplete
          id="adlas-test-ac"
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={options}
          value={value}
          onChange={(_, newVal) => {
            if (typeof newVal === "string") {
              setTimeout(() => {
                setDialogValue({
                  title: newVal,
                  val: newVal,
                });
                toggleOpen(true);
              });
            } else if (newVal && newVal.inputValue) {
              setDialogValue({
                title: newVal.val,
                val: newVal.inputValue,
              });
              toggleOpen(true);
            } else {
              setValue(newVal);
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select One or Add your own" />
          )}
          getOptionLabel={(opt) => (typeof opt === "string" ? opt : opt.title)}
          renderOption={({ key, ...optionProps }, opt) => {
            return (
              <Box
                key={key}
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...optionProps}
              >
                {opt.icon ? (
                  <Stack direction="row" spacing={1}>
                    <span>{opt.title}</span>
                    <SvgIcon component={opt.icon} />
                  </Stack>
                ) : (
                  opt.title
                )}
              </Box>
            );
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            const { inputValue } = params;
            const isExisting = options.some(
              (option) => inputValue === option.title
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                inputValue,
                val: inputValue,
                title: `Add "${inputValue}"`,
              });
            }
            return filtered;
          }}
        />
        <Dialog open={open} onClose={handleClose}>
          <form onSubmit={handleSubmit}>
            <DialogTitle>Adding a new option...</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Fill in the fields here and click on "ADD"!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={dialogValue.title}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    title: event.target.value,
                  })
                }
                label="title"
                type="text"
                variant="standard"
              />
              <TextField
                margin="dense"
                id="name"
                value={dialogValue.val}
                onChange={(event) =>
                  setDialogValue({
                    ...dialogValue,
                    val: event.target.value,
                  })
                }
                label="Value"
                type="text"
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Add</Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </>
  );
}

interface Opt {
  inputValue?: string;
  val: string;
  title: string;
  icon?: OverridableComponent<SvgIconTypeMap> & {
    muiName: string;
  };
}

const options: Opt[] = [
  { val: "Education", title: "Education", icon: School },
  { val: "Science", title: "Science", icon: Science },
  { val: "Art", title: "Art", icon: TheaterComedy },
  { val: "Sport", title: "Sport", icon: SportsSoccer },
  { val: "Games", title: "Games", icon: SportsEsports },
];

export default App;
