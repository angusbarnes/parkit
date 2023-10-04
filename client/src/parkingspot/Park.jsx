import React, { useState } from "react";
import "./park.css"
import Button from "../layout/Button"
import Modal from "../modal/Modal";
import { useModal } from "../modal/useModal";
import QRCode from "react-qr-code";

const Park = ({id, toggleStateFunction, state}) => {

    const qrModal = useModal();

    return (
        <div className="grid-item">
            <div className="park">
                <Modal modalState={qrModal}>
                    <h4>Reserve Car Park #{id+1}</h4>
                    <p>Scan this code to reserve this spot!</p>
                    <QRCode
                        size={256}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={"http://parkit.cc"}
                        viewBox={`0 0 256 256`}
                    />
                </Modal>
                <h3>Park #{id+1}</h3>
                <p>
                    This is a park. 
                    Lorem Ipsum etc etc.
                    Generic Text Field Here.
                </p>
                <h4>This spot is currently {state ? "🟢 Free" : "🔴 Taken"}</h4>
                <div className="container">

                    <div className="button-group">
                        <Button disabled={state} color={"blue"} label={"Book"} onClick={() => {toggleStateFunction(id, true)}}/>
                        <Button disabled={state} color={"red"} label={"Cancel"} onClick={() => {toggleStateFunction(id, false)}}/>
                        <button onClick={() => {qrModal.open()}}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height={'auto'} className={"svg-icon"}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Park;