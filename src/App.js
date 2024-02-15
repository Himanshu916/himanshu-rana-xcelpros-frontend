import React, { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useNavigate } from "react-router-dom";
function App() {
  const [fields, setFields] = useState([]);
  const [edit, setEdit] = useState(null);
  const [editText, setEditText] = useState("");
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  function handleDragStart(e, what) {
    e.dataTransfer.setData(what, what);
  }

  function handleDrop(e) {
    const what =
      e.dataTransfer.getData("text") || e.dataTransfer.getData("button");
    console.log(what, "having here");

    if (what === "text")
      setFields([
        ...fields,
        <div className="flex flex-col">
          <label htmlFor="Name">Text Field</label>
          <input
            className="p-2  border border-gray-300 rounded-md"
            type="text"
            id="Name"
          />
        </div>,
      ]);

    if (what === "button")
      setFields([
        ...fields,
        <button className="border border-gray-400 bg-white p-2 rounded-md">
          Button here
        </button>,
      ]);
  }

  const editHandler = (edit) => {
    console.log(edit, "this", editText);
    setEditText("");
    const newFields = fields.map((field, index) => {
      console.log(edit, index, 43);
      if (index === edit) {
        if (field?.type === "div")
          return (
            <div className="flex flex-col">
              <label htmlFor={editText}>{editText}</label>
              <input
                className="p-2  border border-gray-300 rounded-md"
                type="text"
                id={editText}
              />
            </div>
          );
        if (field?.type === "button") {
          console.log("kya bhai", editText);
          return (
            <button className="border border-gray-400 bg-white p-2 rounded-md">
              {editText}
            </button>
          );
        }
      }

      return field;
    });

    console.log(newFields);
    setFields(newFields);
  };
  console.log(edit);

  async function saveForm() {
    try {
      const htmlNeed = fields.map((field, index) => {
        const staticElement = renderToStaticMarkup(field);

        return staticElement;
      });

      const data = await fetch(
        "https://himanshu-rana-xcelpros-jnfb.vercel.app/api/createForm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: "himanshu",
            body: `  <div className="flex flex-col gap-2">
          ${htmlNeed}
          </div>`,
            date: new Date(),
          }),
        }
      );
      const json = await data.json();
      setId(json[0]._id);
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="max-w-[1200px]   mx-auto">
      <header className="bg-gray-200 text-2xl py-2 px-3 rounded-md shadow-[rgb(0,0,0,0.1)] shadow-md">
        Form Builder
      </header>
      <div className="grid  my-4 gap-3  grid-cols-4">
        <div className="col-span-1 p-4">
          <h1 className="mb-3">Basic Elements</h1>
          <input type="text" name="" id="" />
          <div className="flex  flex-col gap-2">
            <button
              draggable
              onDragStart={(e) => handleDragStart(e, "text")}
              className="border border-gray-200"
            >
              Text Input
            </button>
            <button
              draggable
              onDragStart={(e) => handleDragStart(e, "button")}
              className="border border-gray-200"
            >
              Button
            </button>
          </div>
        </div>
        <div className="col-span-2 p-4">
          <h1 className="mb-3">Form Created </h1>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className=" min-h-28 p-4 bg-gray-200"
          >
            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={index}>
                  {React.cloneElement(field, { onClick: () => setEdit(index) })}
                </div>
              ))}
            </div>
            {fields.length !== 0 && (
              <button
                className="border-2 rounded-md p-2 my-4 border-white"
                onClick={saveForm}
              >
                Create Form
              </button>
            )}
            {id && (
              <button
                className="border-2 rounded-md p-2 my-4 border-white"
                onClick={() => navigate(`form/${id}`)}
              >
                See Created Form
              </button>
            )}
          </div>
        </div>
        <div className="col-span-1 p-4">
          <h1 className="mb-3">Edit Text here</h1>
          {edit !== null && (
            <div className="flex flex-col gap-2">
              <input
                placeholder="type here to edit text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border rounded-md p-2 border-black"
                type="text"
              />
              <button
                className="bg-green-600 text-white font-semibold py-2 rounded "
                onClick={() => editHandler(edit)}
              >
                Edit Field
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
