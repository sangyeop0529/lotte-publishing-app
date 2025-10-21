import Calculate from "./components/Calculate";
import FileDownload from "./components/FileDownload";
import SampleCode from "./components/SampleCode";
import SampleImg from "./components/SampleImg";
import UrlLink from "./components/UrlLink";

function App() {
  return (
    <div className="App">
      <Calculate />
      <UrlLink />
      <SampleImg />
      <SampleCode />
      <FileDownload />
    </div>
  );
}

export default App;
