import React, { useState } from "react";
import Header from "../components/Header";
import MyGrid from "../components/MyGrid";
import InfiniteScroll from "react-infinite-scroll-component";

function Home() {
    const [items, setItems] = useState(Array.from({ length: 25 }, (_, i) => `Item ${i + 1}`));
    const [hasMore, setHasMore] = useState(true);

    const fetchMoreData = () => {
        if (items.length >= 100) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setItems(prevItems => [
                ...prevItems,
                ...Array.from({ length: 25 }, (_, i) => `Item ${prevItems.length + i + 1}`)
            ]);
        }, 1500);
    };

    return (
        <>
            <Header />
            <div>
                <h1>Home</h1>
            </div>
            <div>
                <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <b>Yay! You have seen it all</b>
                        </p>
                    }
                >
                    <MyGrid items={items} rows={5} columns={5} />
                </InfiniteScroll>
            </div>
        </>
    );
}

export default Home;
