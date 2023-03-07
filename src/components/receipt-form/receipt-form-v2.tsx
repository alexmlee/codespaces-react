import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

interface StepOneData {
    date: string;
    location: string;
}

interface ItemData {
    name: string;
    quantity: number;
    price: number;
}

interface StepTwoData {
    items: ItemData[];
}

export default function GroceryForm() {
    const [step, setStep] = useState(1);
    const [stepOneData, setStepOneData] = useState<StepOneData>({ date: '', location: '' });
    const [stepTwoData, setStepTwoData] = useState<StepTwoData>({ items: [] });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [parsingError, setParsingError] = useState(false);
    const [parsedData, setParsedData] = useState<Partial<StepOneData & StepTwoData>>({});

    const handleStepOneSubmit = async (data: StepOneData) => {
        if (imageFile) {
            try {
                const result = await Tesseract.recognize(imageFile,  'eng');
                const text = result.data.text;

                // Parse metadata and item data from OCR text
                // ...

                // setParsedData(parsedData => ({ ...parsedData, ...metadata, ...items }));
                setStep(2);
            } catch (error) {
                console.error(error);
                setParsingError(true);
            }
        } else {
            setStepOneData(data);
            setStep(2);
        }
    };

    const handleStepTwoSubmit = (data: StepTwoData) => {
        setStepTwoData(data);
        // submitFormData({ ...stepOneData, ...stepTwoData, ...parsedData });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        // setImageFile(file);
    };

    const handleRetryParsing = () => {
        setParsingError(false);
        setParsedData({});
    };

    return (
        <div>
            {step === 1 && (
                <StepOneForm onSubmit={handleStepOneSubmit} onImageUpload={handleImageUpload} parsingError={parsingError} />
            )}
            {step === 2 && <StepTwoForm onSubmit={handleStepTwoSubmit} parsedData={parsedData} />}
            {parsingError && (
                <div>
                    <p>Sorry, there was an error parsing the image.</p>
                    <button onClick={handleRetryParsing}>Retry</button>
                </div>
            )}
        </div>
    );
}

interface StepOneFormProps {
    onSubmit: (data: StepOneData) => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    parsingError: boolean;
}

function StepOneForm({ onSubmit, onImageUpload, parsingError }: StepOneFormProps) {
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({ date, location });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" value={date} onChange={(event) => setDate(event.target.value)} />

            <label htmlFor="location">Location:</label>
            <input type="text" id="location" value={location} onChange={(event) => setLocation(event.target.value)} />

            <label
                htmlFor="receipt-image">Receipt Image:</label>
            <input type="file" id="receipt-image" accept="image/*" onChange={onImageUpload} />

            {parsingError && <p>Unable to parse metadata from image. Please fill in manually.</p>}

            <button type="submit">Next</button>
        </form>
    );
}

interface StepTwoFormProps {
    onSubmit: (data: StepTwoData) => void;
    parsedData: Partial<StepOneData & StepTwoData>;
}

function StepTwoForm({ onSubmit, parsedData }: StepTwoFormProps) {
    const [items, setItems] = useState<ItemData[]>([]);
    const [itemName, setItemName] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [itemPrice, setItemPrice] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit({ items });
    };

    const handleAddItem = () => {
        const price = parseFloat(itemPrice);
        if (isNaN(price)) {
            return;
        }
        setItems([...items, { name: itemName, quantity: itemQuantity, price }]);
        setItemName('');
        setItemQuantity(1);
        setItemPrice('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="item-name">Item Name:</label>
            <input type="text" id="item-name" value={itemName} onChange={(event) => setItemName(event.target.value)} />
            <label htmlFor="item-quantity">Quantity:</label>
            <input type="number" id="item-quantity" value={itemQuantity} onChange={(event) => setItemQuantity(parseInt(event.target.value))} />

            <label htmlFor="item-price">Price:</label>
            <input type="text" id="item-price" value={itemPrice} onChange={(event) => setItemPrice(event.target.value)} />

            <button type="button" onClick={handleAddItem}>Add Item</button>

            <ul>
                {items.map((item, index) => (
                    <li key={index}>
                        <span>{item.name} ({item.quantity}):</span>
                        <span>${item.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <button type="submit">Submit</button>
        </form>
    );
}
