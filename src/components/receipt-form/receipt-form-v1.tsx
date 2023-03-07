import React, { useState } from "react";

interface StepOneData {
  date: string;
  location: string;
}

interface StepTwoData {
  items: string[];
  prices: number[];
}

interface FormData {
  stepOneData: StepOneData;
  stepTwoData: StepTwoData;
}

function GroceryForm(): JSX.Element {
  const [step, setStep] = useState(1);
  const [stepOneData, setStepOneData] = useState<StepOneData>({ date: "", location: "" });
  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({ items: [], prices: [] });

  const handleStepOneSubmit = (data: StepOneData) => {
    setStepOneData(data);
    setStep(2);
  };

  const handleStepTwoSubmit = (data: StepTwoData) => {
    setStepTwoData(data);
    submitFormData({ stepOneData, stepTwoData });
  };

  const submitFormData = (data: FormData) => {
    // Call API or perform other actions with form data
    console.log(data);
  };

  return (
    <div>
      {step === 1 && <StepOneForm onSubmit={handleStepOneSubmit} />}
      {step === 2 && <StepTwoForm onSubmit={handleStepTwoSubmit} />}
    </div>
  );
}

interface StepOneFormProps {
  onSubmit: (data: StepOneData) => void;
}

function StepOneForm({ onSubmit }: StepOneFormProps): JSX.Element {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ date, location });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="date">Date:</label>
      <input type="text" id="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label htmlFor="location">Location:</label>
      <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />

      <button type="submit">Next</button>
    </form>
  );
}

interface StepTwoFormProps {
  onSubmit: (data: StepTwoData) => void;
}

function StepTwoForm({ onSubmit }: StepTwoFormProps): JSX.Element {
  const [items, setItems] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const handleAddItem = (event: React.FormEvent) => {
    event.preventDefault();
    if (itemName && itemPrice) {
      setItems([...items, itemName]);
      setPrices([...prices, parseFloat(itemPrice)]);
      setItemName("");
      setItemPrice("");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ items, prices });
  };

  return (
    <form onSubmit={handleSubmit}>
      {items.map((item, index) => (
        <div key={index}>
          <span>{item} - ${prices[index]}</span>
        </div>
      ))}

      <label htmlFor="itemName">Item name:</label>
      <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} />
      <label htmlFor="itemPrice">Item price:</label>
      <input type="text" id="itemPrice" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
    
      <button type="button" onClick={handleAddItem}>
        Add Item
      </button>
    
      <button type="submit">Submit</button>
    </form>
    );
}