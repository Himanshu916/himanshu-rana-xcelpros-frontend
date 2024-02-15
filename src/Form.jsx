import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Form() {
  const [formFromBackend, setFormFromBackend] = useState([]);
  const { id } = useParams();
  useEffect(
    function () {
      getForm(id);
    },
    [id]
  );

  const getForm = async (id) => {
    try {
      const data = await fetch(`http://localhost:8000/?id=${id}`);
      const json = await data.json();
      console.log(json);
      setFormFromBackend([json.data.body]);
    } catch (error) {}
  };

  if (formFromBackend.length === 0) <p>Loading...</p>;
  console.log(formFromBackend);
  const htmlString = formFromBackend[0];
  return (
    <div
      className="max-w-96 mx-auto"
      dangerouslySetInnerHTML={{ __html: htmlString }}
    ></div>
  );
}

export default Form;
