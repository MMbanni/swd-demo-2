import Link from "next/link";

export default function HomePage() {
    return (
        <main className="home">
            <h1>Household Appliance Inventory</h1>

            <p>Welcome. Please choose an option below.</p>

            <nav className="homeMenu">
                <Link href="/part-b-c">Add Appliance</Link>
                <Link href="/search">Search Appliance</Link>
                <Link href="/update">Update Appliance</Link>
                <Link href="/delete">Delete Appliance</Link>
            </nav>
        </main>
    );
}