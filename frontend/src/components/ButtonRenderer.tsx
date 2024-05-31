import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';

interface Props {
  apiUrl: string; // URL of the backend endpoint
}

interface DisciplinesResponse {
  disciplines: string[];
}

const ButtonRenderer: React.FC<Props> = ({ apiUrl }) => {
  const [items, setItems] = useState<string[]>([]);
  const [reqStatus, setReqStatus] = useState<string>('loading');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data: DisciplinesResponse = await response.json();
        if (response.ok) {
          setItems(data.disciplines);
          console.log(data)
                           
          console.log(data.disciplines)
          setReqStatus('success')
        } else {
          setReqStatus('errrrrr')
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        setReqStatus('errrrrr')
        console.error('Error fetching data: ', error);
        setItems([]);
      }
    };

    fetchData();
  }, [apiUrl]); // Depend on apiUrl to refetch if it changes

  return (
    <div>
      <p>{reqStatus}</p>
       {items?.map((item, index) => (
         <Button key={index} variant="contained" style={{ margin: '10px' }}>
           {item}
         </Button>
       ))}
    </div>
  );
};

export default ButtonRenderer;
