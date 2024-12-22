import { Outlet } from "react-router-dom";
import Container from "../components/common/Container";

function BasePage() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default BasePage;
