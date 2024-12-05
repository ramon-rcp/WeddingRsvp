import React, { Component, ChangeEvent, MouseEvent } from "react";

type AddGuestProps = {
    onAdd: (guest: string, host: "Molly" | "James", isFamily: boolean) => void;
    onBack: () => void;
}

type AddGuestState = {
    guest: string;
    host: "" | "Molly" | "James";
    isFamily: boolean;
    errormsg: "" | "Error: You have to choose a host" | "Error: You have to specify the guest's name";
}

export class AddGuest extends Component<AddGuestProps, AddGuestState> {
    constructor(props: AddGuestProps) {
        super(props)

        this.state = {guest: "", host: "", isFamily: false, errormsg: ""}
    }

    render = (): JSX.Element => {
        return <div>
            <div><h1>Add Guest</h1></div>
            <div>
                <label>Name: </label>
                <input type="text" value={this.state.guest} onChange={this.doNameChange}></input>
            </div>
            <div>
                <div><label>Guest of: </label></div>
                <div><input type="radio" name="host" value="Molly" onChange={this.doMollyClick}></input>Molly</div>
                <div><input type="radio" name="host" value="James" onChange={this.doJamesClick}></input>James</div>
            </div>
            <div>
                <input type="checkbox" name="Family" value="Family" onChange={this.doFamilyClick}></input>Family
            </div>
            <div><button onClick={this.doAddClick}>Add</button>   <button onClick={this.doBackClick}>Back</button></div>
            <div><h3>{this.state.errormsg}</h3></div> 
        </div>
    }

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({guest: evt.target.value, errormsg: ""})
    }

    doMollyClick = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({host: "Molly", errormsg: ""})
    }

    doJamesClick = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({host: "James", errormsg: ""})
    }

    doFamilyClick = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({isFamily: evt.target.checked})
    }

    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.state.host === "") {
            this.setState({errormsg: "Error: You have to choose a host"})
        }
        else if(this.state.guest === "") {
            this.setState({errormsg: "Error: You have to specify the guest's name"})
        }
        else {
            this.props.onAdd(this.state.guest, this.state.host, this.state.isFamily)
        }
    }

    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    }
}