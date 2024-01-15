import { useFeedbackItemsStore } from "../../stores/feedbackitemsStore";
import FeedbackForm from "../feedback/FeedbackForm";
import Logo from "../Logo";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";

export default function Header() {
  // const {handleAddToList} = useFeedbackItemsContext()

  const addItemToList = useFeedbackItemsStore(state=> state.addItemToList)

  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedbackForm onAddToList={addItemToList} />
    </header>
  );
}
