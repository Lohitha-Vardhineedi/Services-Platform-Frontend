import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="px-4 sm:px-6 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
};

export default App;
