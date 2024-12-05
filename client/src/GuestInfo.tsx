import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Guest } from "./GuestType";

type GuestInfoProps = {
    guest: Guest | undefined;
    onSave: (guest: Guest) => void;
    onBack: () => void;
}

type GuestInfoState = {
    restrictions: {guest: string, addguest?: string};
    addguest: undefined | 0 | 1;
    addguestname: string;
    errormsg: "" | "Specify your dietary restrictions" | "Who is your plus one?" | "Specify your plus one's dietary restrictions";
}

export class GuestInfo extends Component<GuestInfoProps, GuestInfoState> {
    constructor (props: GuestInfoProps) {
        console.log(props.guest)
        super(props)
        this.state = {restrictions: (props.guest?.info.restrictions === undefined) ? {guest: ""} : props.guest.info.restrictions, 
            addguest: props.guest?.info.plusone, 
            addguestname: (props.guest?.info.plusonename===undefined) ? "" : props.guest?.info.plusonename,
            errormsg: ""}
    }

    render = (): JSX.Element => {
        if(this.props.guest === undefined) {
            return <div>Error fetching guest</div>
        }
        return <div>
            <div><h1>Guest Details</h1></div>
            <div>
                {this.props.guest.name}, guest of {this.props.guest.info.host}, {this.props.guest.info.isFamily ? "" : "not"} family
            </div>
            <div>Dietary Restrictions ('none' if none):</div>
            <div><input type="text" onChange={this.doRestrictionChange} value={this.props.guest.info.restrictions?.guest}></input></div>
            <div>
                Additional Guest? 
                <select onChange={this.doChooseAdditionalChange} defaultValue={(this.state.addguest===undefined) ? "undefined" : this.state.addguest.toString()}>
                    <option value="undefined">Unknown</option>
                    <option value="1">1</option>
                    <option value="0">0</option>
                </select>
            </div>
            {this.renderExtra()}
            <div><button onClick={this.doSaveClick}>Save</button> <button onClick={this.doBackClick}>Back</button></div>
            <div><h3>{this.state.errormsg}</h3></div>
        </div>
    }

    renderExtra = (): JSX.Element => {
        if(this.state.addguest === 1){
            return <div>
                <div>Guest Name: <input type="text" onChange={this.doAdditionalNameChange} 
                    value={this.state.addguestname}></input></div>
                <div>Guest Dietary Restrictions ('none' if none):</div>
                <div><input type="text" onChange={this.doAdditionalRestrictionChange}
                    value={(this.state.restrictions.addguest===undefined) ? "" : this.state.restrictions.addguest}></input></div>
            </div>
        } 
        else {
            return <div></div>
        }
    }

    doAdditionalNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({addguestname: evt.target.value})
    }

    doAdditionalRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({restrictions: {guest: this.state.restrictions.guest, addguest: evt.target.value}})
    }

    doRestrictionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({restrictions: {guest: evt.target.value, addguest: this.state.restrictions.addguest}})
    }

    doChooseAdditionalChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        if(evt.target.value === "undefined") {
            this.setState({addguest: undefined})
        }
        else {
            const num: number = Number(evt.target.value);
            if(num !== 1 && num !== 0) {
                return;
            }
            this.setState({addguest: num})
        }
    }

    doSaveClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if(this.props.guest === undefined) {
            throw new Error("can't find guest")
        }
        else if(this.state.restrictions.guest === "") {
            this.setState({errormsg: "Specify your dietary restrictions"})
        }
        else if(this.state.addguest === 1 && this.state.addguestname === "") {
            this.setState({errormsg: "Who is your plus one?"})
        }
        else if(this.state.addguest === 1 && (this.state.restrictions.addguest === "" || this.state.restrictions.addguest === undefined)){
           this.setState({errormsg: "Specify your plus one's dietary restrictions"})
        }
        else {
            console.log("saving");
            
            const newGuest: Guest = {
                name: this.props.guest.name,
                info: {
                    host: this.props.guest.info.host,
                    isFamily: this.props.guest.info.isFamily,
                    plusone: this.state.addguest,
                    plusonename: this.state.addguestname,
                    restrictions: this.state.restrictions
                }
            }
            this.props.onSave(newGuest);
        }
    }

    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
    }
}