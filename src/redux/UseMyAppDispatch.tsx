// import { useDispatch } from 'react-redux';
// import type { AppDispatch } from '../redux/store'; // Import your store's AppDispatch type

// export const UseMyAppDispatch = () => useDispatch<AppDispatch>();



import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from './store';

export const UseMyAppDispatch = () => useDispatch<AppDispatch>();
export const UseMyAppSelector: TypedUseSelectorHook<RootState> = useSelector;
