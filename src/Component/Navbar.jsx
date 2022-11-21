import Nav from "react-bootstrap/Nav"

export default function Navbar() {
    return (
        <Nav id="Nav">
            <Nav.Item className="Item">
                <Nav.Link href="/">Accueil</Nav.Link>
            </Nav.Item>
            <Nav.Item className="Item">
                <Nav.Link href="/AddPool">AddPool</Nav.Link>
            </Nav.Item>
            <Nav.Item className="Item">
                <Nav.Link href="/Stacking">Stacking</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
