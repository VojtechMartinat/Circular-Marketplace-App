import React from 'react';
import './shippingModal.css';
import { TbTruckDelivery } from "react-icons/tb";

const ShippingModal = ({ options, onClose, onSelect, selectedOption }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select Shipping Method</h2>
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`option ${selectedOption === index ? 'selected' : ''}`}
                        onClick={() => onSelect(index)}
                    >
                        <input type="radio" checked={selectedOption === index} readOnly />
                        <div>
                            <strong>{option.title} </strong>
                            <p>{option.description}</p>
                        </div>
                    </div>
                ))}
                <div className="modal-actions">
                    <button onClick={onClose} className="modal-button confirm">Confirm Selection</button>
                    <button onClick={onClose} className="modal-button cancel">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ShippingModal;
