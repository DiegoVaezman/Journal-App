import { AppRouter } from './router/AppRouter';
import { BrowserRouter } from 'react-router-dom';
import { AppTheme } from './theme';
import { Provider } from 'react-redux';
import { store } from './store';

export const JournalApp = () => {
    return (
        <AppTheme>
            <Provider store={store}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </Provider>
        </AppTheme>
    );
};
