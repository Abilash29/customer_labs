import React, { useState } from "react";
import "./App.css";

function App() {
  const [showPanel, setShowPanel] = useState(false);
  const [schemas, setSchemas] = useState([]);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");

  const schemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const handleAddSchema = () => {
    if (selectedSchema && !schemas.includes(selectedSchema)) {
      setSchemas([...schemas, selectedSchema]);
      setSelectedSchema("");
    }
  };

  const handleRemoveSchema = (index) => {
    setSchemas(schemas.filter((_, i) => i !== index));
  };

  const handleSaveSegment = async () => {
    const data = {
      segment_name: segmentName,
      schema: schemas.map((value) => {
        const option = schemaOptions.find((opt) => opt.value === value);
        return option ? { [value]: option.label } : null;
      }).filter((item) => item !== null),
    };

    try {
      const response = await fetch(
        "/webhook/4d8a6df2-6dc6-4f83-b956-62f0ede9875c",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const result = await response.text();
      console.log("Server Response:", result);

      setSegmentName("");
      setSchemas([]);
      setShowPanel(false);
      alert("Segment saved successfully!");
    } catch (error) {
      console.error("Error sending segment data:", error);
      alert("An error occurred while saving the segment. Please try again.");
    }
  };

  const availableOptions = schemaOptions.filter(
    (option) => !schemas.includes(option.value)
  );

  return (
    <div className={`App ${showPanel ? "blurred" : ""}`}>
      <div className="App-content">
        <button onClick={() => setShowPanel(true)}>Save Segment</button>
      </div>

      <div className={`right-panel ${showPanel ? "open" : ""}`}>
        <div className="panel-header-container">
          <div className="panel-header">
            <h2>Save Segment</h2>
            <img
              src={`${process.env.PUBLIC_URL}/close.png`}
              alt="Close"
              className="close-icon"
              onClick={() => setShowPanel(false)}
            />
          </div>
        </div>

        <div className="panel-content">
          <h3>Enter the Name of the Segment</h3>
          <input
            type="text"
            placeholder="Name of the segment"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
          />

          <h3>Add schemas to build the query:</h3>
          <div className="schema-box">
            {schemas.map((schema, index) => (
              <div key={index} className="schema-item">
                <select
                  value={schema}
                  onChange={(e) => {
                    const updatedSchema = e.target.value;
                    setSchemas(
                      schemas.map((item, idx) =>
                        idx === index ? updatedSchema : item
                      )
                    );
                  }}
                >
                  <option value={schema} disabled>
                    {schemaOptions.find((opt) => opt.value === schema)?.label}
                  </option>
                  {availableOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleRemoveSchema(index)}>Remove</button>
              </div>
            ))}
          </div>

          <div>
            <select
              onChange={(e) => setSelectedSchema(e.target.value)}
              value={selectedSchema}
              defaultValue=""
            >
              <option value="" disabled>
                Add schema to segment
              </option>
              {availableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="add-schema-button" onClick={handleAddSchema}>
              + Add New Schema
            </button>
          </div>

          <div className="button-group">
            <button className="save-button" onClick={handleSaveSegment}>
              Save the Segment
            </button>
            <button className="cancel-button" onClick={() => setShowPanel(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
