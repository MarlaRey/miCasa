// src/components/EstateList.jsx
import { useEffect, useState } from 'react';
import supabase from '../../supabase';

const EstateList = () => {
  const [estates, setEstates] = useState([]);

  useEffect(() => {
    const fetchEstates = async () => {
      let { data, error } = await supabase
        .from('estates')
        .select('id, primary_image, address, postal_code, city, type, size, energy_class, price');
      if (error) console.log('Error fetching estates:', error);
      else setEstates(data);
    };

    fetchEstates();
  }, []);

  return (
    <div className="estate-list">
      {estates.map(estate => (
        <div key={estate.id}>
          <img src={estate.primary_image} alt={estate.address} />
          <p>{estate.address}, {estate.city}</p>
          <p>{estate.price} kr.</p>
        </div>
      ))}
    </div>
  );
};

export default EstateList;
