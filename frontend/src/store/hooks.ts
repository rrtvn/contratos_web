import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/** Hook tipado de dispatch */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/** Hook tipado de selector */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
