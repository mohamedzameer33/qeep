// src/components/FriendZoo.jsx
import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function FriendZoo() {
 const [data, setData] = useState({ coins: 0, praiseValue: 0, currentOwner: 'Free', pets: [] });
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 const load = async () => {
 try {
 const [balance, owner, pets] = await Promise.all([
 api.get('/coins/balance'),
 api.get('/zoo/my-owner'),
 api.get('/zoo/my-pets')
 ]);
 setData({
 coins: balance.data.data,
 praiseValue: owner.data.data.praiseValue || 0,
 currentOwner: owner.data.data.currentOwner || 'Free',
 pets: pets.data.data || []
 });
 } catch (err) {
 console.log("Failed - check proxy & token");
 } finally {
 setLoading(false);
 }
 };
 load();
 }, []);

 if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading...</div>;

 return (
 <div style={{padding: '40px', background: '#f0f8ff', minHeight: '100vh'}}>
 <h1 style={{textAlign: 'center', fontSize: '50px', marginBottom: '30px'}}>Friend Zoo </h1>
 
 <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '40px'}}>
 <div style={{background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center'}}>
 <h3>Coins</h3>
 <p style={{fontSize: '42px', fontWeight: 'bold', color: 'gold'}}>{data.coins}</p>
 </div>
 <div style={{background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center'}}>
 <h3>Praise</h3>
 <p style={{fontSize: '42px', fontWeight: 'bold', color: '#ff69b4'}}>{data.praiseValue}</p>
 </div>
 <div style={{background: 'white', padding: '30px', borderRadius: '20px', textAlign: 'center'}}>
 <h3>Owner</h3>
 <p style={{fontSize: '32px'}}>{data.currentOwner}</p>
 </div>
 </div>

 <h2>Your Pets ({data.pets.length})</h2>
 <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '25px'}}>
 {data.pets.map(pet => (
 <div key={pet.id} style={{background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center'}}>
 <div style={{fontSize: '80px'}}>Dog</div>
 <h3>{pet.username}</h3>
 <p>Praise: {pet.praiseValue} stars</p>
 </div>
 ))}
 </div>
 </div>
 );
}