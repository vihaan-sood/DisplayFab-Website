import Header from "../components/Header";
import Grid from "../components/Grid";

function Home() {

    const rows = 5;
    const columns = 5;
    const items = Array.from({ length: rows * columns }, (_, i) => `Item ${i + 1}`);






    return (<>
        <Header />
        <div>
            <h1>
                Home
            </h1>
        </div>
        <div>
            <Grid items={items} rows={rows} columns={columns} />
        </div>
        
    </>
    );
};

export default Home;