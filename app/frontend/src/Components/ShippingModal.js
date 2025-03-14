import React, {useEffect} from 'react';
import './shippingModal.css';

const ShippingModal = ({ options, onClose, onSelect, selectedOption }) => {
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            onClose();
        }
    };



    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, );
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
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
