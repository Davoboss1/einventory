import React from "react";
//Material UI components imports
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

//Material UI Icons imports
import MenuIcon from "@mui/icons-material/Menu";
import Save from "@mui/icons-material/Save";
import Search from "@mui/icons-material/Search";
import Sort from "@mui/icons-material/SortSharp";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import ArrowRight from "@mui/icons-material/ArrowRight";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import Delete from "@mui/icons-material/Delete";
import Clear from "@mui/icons-material/Clear";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Edit from "@mui/icons-material/Edit";
import Facebook from "@mui/icons-material/Facebook";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import Reddit from "@mui/icons-material/Reddit";
import Twitter from "@mui/icons-material/Twitter";

//Css and images imports
import "./global.css";
import style from "./App.module.css";
import add_icon from "./images/add-svgrepo-com.svg";
import img from "./images/item.webp";

//Global categories and items object
var categories = [];
// Categories sort functions


const sortByName = (a,b) => {
  let first_val = a.item_name.toLowerCase();
  let second_val = b.item_name.toLowerCase();

  if (first_val < second_val) return -1;
  if (first_val > second_val) return 1;
  return 0;
}

const sortByCount = (a,b) => {
  return a.item_count - b.item_count;
}

const sortByArrayName = (array,reverse) => {
  let temp_arr = [...array];
  temp_arr.sort(sortByName);
  if(reverse){
    temp_arr.reverse();
  }
  return temp_arr;
}

const sortByArrayCount = (array,reverse) => {
  let temp_arr = [...array];
  temp_arr.sort(sortByCount);
  if(reverse){
    temp_arr.reverse();
  }
  return temp_arr;
}

const searchThroughItems = (textVal,array) => {

  let new_arr = array.filter((element) => {
    let text = element.item_name.toLowerCase();
    return text.includes(textVal);
  });
  return new_arr;
}

//Alert Dialog component
function AlertDialog(props) {

  //Function to close dialog
  const handleClose = () => {
    props.closeDialog();
  };

  //Function to perform action via props then close it
  const dialogConfirm = () => {
    props.action();
    props.closeDialog();
  };

  return (
    <div>
      <Dialog
        open={props.open ? true : false}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmation Dialog"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={dialogConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

//Variable to hold index of current category
//var categoryIndex = 0;


function Item(props) {
  let item = props.item;
  if (item === undefined) item = {item_name: "", item_count: "",item_image: img};
  //state hooks
  const [deletedState, setDeletedState] = React.useState(false);

  //ref hooks
  const itemElement = React.useRef(null);
  const textInput = React.useRef(null);
  const newItemInput = React.useRef(null);
  const newItemCountInput = React.useRef(null);
  const newItemImageInput = React.useRef(null);
  const itemCountElement = React.useRef(null);

  //Other variables
  let setItemCount = props.actions.setItemCount
  let item_type;

  if(deletedState){
    return null;
  }

  //Creates new item and add it to categories
  const createItem = () => {
      let item_name = newItemInput.current.value;
      let item_count =  newItemCountInput.current.value;
      let item_image =  newItemImageInput.current.src;
      if (props.actions.addNewItem !== undefined){
        props.actions.addNewItem(item_name, item_count, item_image);
        setDeletedState(true);
      }
      else
        props.actions.editItem(item.id,item_name, item_count, item_image);
  }

  const removeItem = () => {
    props.actions.showDialog(
      true,
      "Are you sure you want to delete this item",
      () => {
        if (props.actions.addNewItem !== undefined)
          setDeletedState(true);
        else{
          //setHideState(true);
          props.actions.removeItem(item.id);

        }
      }
    )
  }

  const ImageUploadHandler = (event) => {
    let imageInput = event.target;
    newItemImageInput.current.src = window.URL.createObjectURL(imageInput.files[0]);
  }

  let image_input_id = "image-input" + (item.id !== undefined ? item.id: ("new-" + props.newItemIndex));
  //Render editable item or normal item
  if (props.input) {
    item_type = (
      <>
        <div className="d-flex">
        <label className="w-80" htmlFor={image_input_id}>
          <Input id={image_input_id} accept="image/*" className={"d-none"} type="file" onChange={ImageUploadHandler} />
          <Button variant="contained" component="span" className={`${style.App_Uploadbutton} d-block mt-10px`} >
            Upload
          </Button>
        </label>

          <IconButton
            className={style.App_Editiconbutton}
            style={{ marginTop: "13px", marginLeft: "16px" }}
            onClick={removeItem}
          >
            <Clear />{" "}
          </IconButton>
        </div>

        <div>
          <TextField
            label="Name"
            variant="filled"
            color="error"
            sx={{ width: 0.8, m: 1 }}
            defaultValue={item.item_name}
            inputRef={newItemInput}
          />
          <TextField
            label="Count"
            variant="filled"
            color="error"
            defaultValue={item.item_count}
            sx={{ width: 0.8, m: 1 }}
            inputRef={newItemCountInput}
          />
          <Button variant="contained" className={style.App_Editbutton} onClick={createItem}>
            Submit
          </Button>
        </div>
      </>
    );
  } else {
    item_type = (
      <>
        <div>
          <h2>{item.item_name}</h2>
          <h4 className={style.App_ItemCountText} ref={itemCountElement}>{item.item_count}</h4>
          <div className={style.App_Iteminputcontainer}>
            <IconButton
              className={style.App_Inputicons}
              size="large"
              onClick={() => setItemCount(item.id,itemCountElement.current, parseInt(itemCountElement.current.textContent)- parseInt(textInput.current.value))}
            >
              <Remove />{" "}
            </IconButton>
            <TextField
              label="Count"
              variant="standard"
              color="error"
              sx={{ width: 100, mx: 1 }}
              defaultValue={1}
              inputRef={textInput}
            />
            <IconButton
              className={style.App_Inputicons}
              size="large"
              onClick={() => setItemCount(item.id,itemCountElement.current, parseInt(textInput.current.value) + parseInt(itemCountElement.current.textContent))}
            >
              <Add />{" "}
            </IconButton>
          </div>
        </div>
      </>
    );
  }

  return (
    <Grid lg={3} md={4} item className={style.App_Itemcontainer} sx={{}} ref={itemElement} >
      <img ref={newItemImageInput} src={item.item_image} className={style.App_Itemimage} alt="" onError={(e) => e.target.src=img} />
      {item_type}
    </Grid>
  );
}


//Shows all Items and Categories
function ItemView() {

  //State hooks

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElSort, setAnchorElSort] = React.useState(null);
  const [addItem, setAddItem] = React.useState([]);
  const [items, setItems] = React.useState(categories[0] ? categories[0].items : []);
  const [categoryIndex, setCategoryIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [menuTitle, setMenuTitle] = React.useState(categories[0] ? categories[0].name : null);
  const [menuCategories, setMenuCategories] = React.useState(categories);
  const [dialogState, setDialogState] = React.useState({});
  let [toggleInput, settoggleInput] = React.useState(false);

  const categoryInputElement = React.useRef(null);
  const searchInput = React.useRef(null);


  //Other Variables
  const open = Boolean(anchorEl);
  const openSort = Boolean(anchorElSort);
  let pages_available = parseInt(items.length / 20) + (items.length % 20 ? 1 : 0);

  //Event Handling functions
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickSort = (event) => {
    setAnchorElSort(event.currentTarget);
  };

  //Close Dropdon menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseSort = () => {
    setAnchorElSort(null);
  };

  //Render items based on selected category
  //Update categoryIndex to curent category
  const showItems = (index) => {
    setItems(categories[index].items);
    setCategoryIndex(index);
    setMenuTitle(categories[index].name);
    handleClose();

    //Clear add items array
    setAddItem([]);
  };

  //Update global categpries and rerender items
  const addNewItem = (item_name, item_count, item_image) => {
    let current_arr = categories[categoryIndex].items || [];
    console.log(current_arr.length);
    console.log(current_arr);
    //Generate id for new item by adding 1 to last item id
    // Default to 1 if item id is undefined or invalid
    let new_item_id = (current_arr.length ? (current_arr[current_arr.length-1].id + 1) : 1);
    let new_item = {id: new_item_id, item_name, item_count: item_count, item_image: item_image};
    categories[categoryIndex].items = [...current_arr, new_item];
    console.log(categories[categoryIndex].items);
    setItems([new_item,...current_arr]);
  }

  const editItem = (itemId, item_name, item_count, item_image) => {
    let index = categories[categoryIndex].items.findIndex(item => item.id === itemId);
    showDialog(true, "Are you sure you want to edit this item", () => {
    categories[categoryIndex].items[index] = {item_name: item_name, item_count: item_count, item_image: item_image}
    setItems(searchThroughItems(searchInput.current.value,categories[categoryIndex].items));
  })
  }

  const removeItem = (itemId) => {
    let index = categories[categoryIndex].items.findIndex(item => item.id === itemId);
    categories[categoryIndex].items.splice(index,1);
    setItems(searchThroughItems(searchInput.current.value,categories[categoryIndex].items));

  }

  const setItemCount = (itemId, itemElement, value) => {
    let index = categories[categoryIndex].items.findIndex(item => item.id === itemId);
    categories[categoryIndex].items[index].item_count = value;
    itemElement.textContent = value;
  }

  //Function to show Alert Dialog
  const showDialog = (open, message, action) => {
    setDialogState({ open: open, message: message, action: action });
  };

  //Function to close Alert Dialog
  const closeDialog = () => {
    setDialogState({ open: false });
  };

  const createCategory = () => {
    categories = [...categories,{name: categoryInputElement.current.value, items: []}]
    setMenuCategories(categories);
    categoryInputElement.current.value = "";
  }

  const removeCategory = (index) => {
    categories.splice(index,1);
    setMenuCategories([...categories]);
  }

  return (
    <>
      <Box className={style.App_Topbar}>
        <Button
          sx={{ color: "gray", ml: 4 }}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <h3 className="my-auto">{menuTitle || "No Category"}</h3>
          <ArrowDropDownIcon />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className={style.App_Dropdownmenu}
        >
          {menuCategories.map((category, index) => (
            <MenuItem key={category+index} onClick={() => showItems(index)} onClose={handleClose}>
              {category.name} <Delete className={"ml-auto px-10px"} onClick={(event) => {
                  event.stopPropagation();
                  showDialog(true, "Are you sure you want to delete this category and all of it's items. This action cannot be undone.",() => removeCategory(index));
                }}/>
            </MenuItem>
          ))}

          <MenuItem>
            <TextField
              label="Add Category"
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
              onKeyDown={(e) => e.stopPropagation()}
              inputRef={categoryInputElement}
            />
            <IconButton
              className={style.App_Addiconbutton}
              style={{
                marginRight: 0,
                marginLeft: "auto",
                padding: 0,
                width: "20px",
                height: "20px",
              }}
              onClick={createCategory}
            >
              <img src={add_icon} alt="Add icon" />
            </IconButton>
          </MenuItem>
        </Menu>

        <IconButton className={style.App_Editiconbutton} onClick={handleClickSort} >
          <Sort />{" "}
        </IconButton>

        <Menu
          id="sort-menu"
          anchorEl={anchorElSort}
          open={openSort}
          onClose={handleCloseSort}
          className={style.App_Dropdownmenu}
        >
          <h4 className="text-center" style={{margin: "5px"}}>Sort By</h4>
          <hr/>
            <MenuItem onClick={() => {
              setItems(sortByArrayName(items));
              handleCloseSort();
            }}>
              Name Of Items (Ascending)
            </MenuItem>
            <MenuItem  onClick={() => {
              setItems(sortByArrayName(items,true));
              handleCloseSort();
            }}>
              Name Of Items (Descending)
            </MenuItem>
            <MenuItem onClick={() => {
              setItems(sortByArrayCount(items));
              handleCloseSort();
            }} >
              Number Of Items (Ascending)
            </MenuItem>
            <MenuItem onClick={() => {
              setItems(sortByArrayCount(items,true));
              handleCloseSort();
            }} >
              Number Of Items (Descending)
            </MenuItem>
        </Menu>

        <OutlinedInput
          className={style.App_SearchInput}
          size={"small"}
          inputRef={searchInput}
          onKeyUp={(e) => {
            setItems(searchThroughItems(e.target.value,categories[categoryIndex].items));
          }}
          endAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />

        {toggleInput ? (
          <IconButton
            className={style.App_Editiconbutton}
            onClick={() => settoggleInput(false)}
          >
            <Clear />{" "}
          </IconButton>
        ) : (
          <IconButton
            className={style.App_Editiconbutton}
            onClick={() => settoggleInput(true)}
          >
            <Edit />
          </IconButton>
        )}
        {
          categories.length ? (<IconButton
          className={style.App_Addiconbutton}
          onClick={() =>
            setAddItem([
              ...addItem,
              <Item input key={"new-item-"+addItem.length} newItemIndex={addItem.length} actions={{showDialog: showDialog, addNewItem:addNewItem}} />,
            ])
          }
        >
          <img src={add_icon} alt="Add icon" />
        </IconButton>) : null
        }

      </Box>

      <Box className="d-flex mx-15px">
        <IconButton onClick={() => setPage(page-1)} className="font-medium" style={{visibility: (page===1 ? "hidden" : "visible")}} > <ArrowLeft /> Previous Page</IconButton>
          <strong className={style.pageLabel}>Current page: {page}, Total Pages: {pages_available}</strong>
        <IconButton onClick={() => setPage(page+1)} className="font-medium" style={{visibility: (page>=pages_available ? "hidden" : "visible")}}>Next Page <ArrowRight /></IconButton>
      </Box>
      <Grid container className={style.App_Griditemcontainer} rowSpacing={3}>
        {addItem}
        {items.slice((page*20)-20,page*20).map((item, index) => (
          <Item key={item.item_name+index} item={item} input={toggleInput} actions={{showDialog: showDialog, editItem: editItem, setItemCount: setItemCount, removeItem: removeItem}}/>
        ))}
      </Grid>

      <AlertDialog
        open={dialogState.open}
        message={dialogState.message}
        action={dialogState.action}
        closeDialog={closeDialog}
      />
    </>
  );
}

function Footer() {
  return (
    <Grid container className={style.App_footer}>
      <Grid item lg={4} md={4} sm={12} xs={12} >
        <h4>About Einventory</h4>
        <small>
          This is a web application that allows storage of all personal or any
          inventories, both locally in your web browser or in the cloud
        </small>
      </Grid>
      <Grid item lg={4} md={4} sm={12} xs={13}>
        <h4>Designed by Davo</h4>
        <Box className={style.App_Socialiconscontainer}>
          <a href="#social">
            <Facebook />
          </a>

          <a href="#social">
            <Reddit />
          </a>

          <a href="#social">
            <GitHub />
          </a>

          <a href="#social">
            <LinkedIn />
          </a>

          <a href="#social">
            <Twitter />
          </a>
        </Box>
      </Grid>
    </Grid>
  );
}

//Home page
function App() {

  const [openMessage, setOpenMessage] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("info");

  const showSnackBar = (message, severity) => {
    setSeverity(severity);
    setMessage(message);
    setOpenMessage(true);
  }

  const saveToLocalStorage = () => {
    showSnackBar("Saving to local storage", "info");
    localStorage.setItem("Categories",JSON.stringify(categories));
    showSnackBar("Saved to local storage", "success");

  }

  const getFromLocalStorage = () => {
    let val = localStorage.getItem("Categories");
    return JSON.parse(val);
  }

  categories = getFromLocalStorage() || [];

  return (
    <Box>
      <AppBar position="static" className={style.App_AppBar}>
        <Toolbar>
          <IconButton
            size="small"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
            className={style.App_MenuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            align="center"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            E-inventory
          </Typography>
          <IconButton size="small" className={style.App_SaveButton} onClick={saveToLocalStorage}>
            <Save />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ItemView />
      <Footer />
      <Snackbar open={openMessage} onClose={() => setOpenMessage(false)} autoHideDuration={5000} key="snackBar" anchorOrigin={{horizontal: "right", vertical: "bottom"}}>
        <Alert severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
