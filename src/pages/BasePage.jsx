import { Outlet } from "react-router-dom";
import Container from "../components/Container";

function BasePage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default BasePage;
