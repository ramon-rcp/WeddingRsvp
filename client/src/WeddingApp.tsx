import React, { Component } from "react";
import { isRecord } from './record';
import { AddGuest } from "./AddGuest";
import { GuestList } from "./GuestList";
import { GuestInfo } from "./GuestInfo";
import { fromJson, Guest, toJson } from "./GuestType";


type Page = {kind: "add"} | {kind: "list"} | {kind: "edit", guest: Guest}
// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

type WeddingAppState = {
  show: Page;
}

/** Displays the UI of the Wedding rsvp application. */
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: {kind: "list"}};
  }
  
  render = (): JSX.Element => {
    if(this.state.show.kind === "add") {
      return <div><AddGuest onAdd={this.doAddServerClick} onBack={this.doOpenListClick}></AddGuest></div>;
    }
    else if (this.state.show.kind === "list"){
      return <div><GuestList onOpenAG={this.doOpenAddClick} onOpenG={this.doGetGuestClick}></GuestList>
        </div>
    }
    else {
      return <div><GuestInfo guest={this.state.show.guest} onSave={this.doAddServerHelpClick}
        onBack={this.doOpenListClick}></GuestInfo></div>
    }
  };

  doOpenListClick = (): void => {
    this.setState({show: {kind: "list"}});
  }

  doOpenAddClick = (): void => {
    this.setState({show: {kind: "add"}});
  }

  doGetGuestClick = (name: string): void => {
    fetch("/api/load?name=" + encodeURIComponent(name))
      .then((res) => this.doLoadResp(res))
      .catch(() => this.doLoadError("failed to connect to server"));
  }

  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => this.doLoadJson(val))
        .catch(() => this.doLoadError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
        .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code: ${res.status}`);
    }
  };

  doLoadJson = (val: unknown): void => {
    if (!isRecord(val) || typeof val.name !== 'string' ||
        val.content === undefined) {
      console.error('Invalid JSON from /api/load', val);
      return;
    }
  
    this.setState({show: {kind: "edit", guest: fromJson(val.content)}})
  };

  doLoadError = (msg: string): void => {
    console.error(`Error fetching /api/load: ${msg}`);
  };

  doAddServerHelpClick = (guest: Guest): void => {
    this.doAddServerClick(
      guest.name, guest.info.host, guest.info.isFamily, guest.info.plusone, 
      guest.info.plusonename, guest.info.restrictions
    )
  }

  doAddServerClick = (guest: string, host: "Molly" | "James", isFamily: boolean, 
    plusone?: 0 | 1, plusonename?: string, restrictions?: {guest: string, addguest?: string}): void => {
    const name = guest.trim();
    const newGuest: Guest = {name: guest, info: {
      host: host, isFamily: isFamily, plusone: plusone, plusonename: plusonename,
      restrictions: restrictions
    }}
    if (name.length > 0) {
      fetch("/api/save", {method: 'POST', body: JSON.stringify({name: name, content: toJson(newGuest)}),
      headers: {'Content-Type': 'application/json'}})
        .then((res) => this.doAddResp(res))
        .catch(() => this.doAddError("failed to connect to server"));
    }
  };

  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => this.doAddJson(val))
          .catch(() => this.doAddError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doAddError)
          .catch(() => this.doAddError("400 response is not name"));
    } else {
      this.doAddError(`bad status code ${res.status}`);
    }
  };

  doAddJson = (val: unknown): void => {
    if (!isRecord(val) || typeof val.saved !== 'boolean') {
      console.error('Invalid JSON from /api/save', val);
      return;
    }
  
    if(!val.saved){
      throw new Error("guest wasn't saved")
    }
    else{
      this.doOpenListClick()
    }
  }

  doAddError = (msg: string): void => {
    console.error(`Error fetching /api/save: ${msg}`);
  };

}


// type WeddingAppState = {
//   name: string;  // mirror state of name text box
//   msg: string;   // message sent from server
// }


// /** Displays the UI of the Wedding rsvp application. */
// export class WeddingApp extends Component<{}, WeddingAppState> {

//   constructor(props: {}) {
//     super(props);

//     this.state = {name: "", msg: ""};
//   }
  
//   render = (): JSX.Element => {
//     return (<div>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input type="name" id="name" value={this.state.name}
//                  onChange={this.doNameChange}></input>
//           <button onClick={this.doDummyClick}>Dummy</button>
//         </div>
//         {this.renderMessage()}
//       </div>);
//   };

//   renderMessage = (): JSX.Element => {
//     if (this.state.msg === "") {
//       return <div></div>;
//     } else {
//       return <p>Server says: {this.state.msg}</p>;
//     }
//   };

//   doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
//     this.setState({name: evt.target.value, msg: ""});
//   };

//   doDummyClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
//     const name = this.state.name.trim();
//     if (name.length > 0) {
//       const url = "/api/dummy?name=" + encodeURIComponent(name);
//       fetch(url).then(this.doDummyResp)
//           .catch(() => this.doDummyError("failed to connect to server"));
//     }
//   };

//   doDummyResp = (res: Response): void => {
//     if (res.status === 200) {
//       res.json().then(this.doDummyJson)
//           .catch(() => this.doDummyError("200 response is not JSON"));
//     } else if (res.status === 400) {
//       res.text().then(this.doDummyError)
//           .catch(() => this.doDummyError("400 response is not name"));
//     } else {
//       this.doDummyError(`bad status code ${res.status}`);
//     }
//   };

//   doDummyJson = (data: unknown): void => {
//     if (!isRecord(data)) {
//       console.error("200 response is not a record", data);
//       return;
//     }

//     if (typeof data.msg !== "string") {
//       console.error("'msg' field of 200 response is not a string", data.msg);
//       return;
//     }

//     this.setState({msg: data.msg});
//   }

//   doDummyError = (msg: string): void => {
//     console.error(`Error fetching /api/dummy: ${msg}`);
//   };

// }