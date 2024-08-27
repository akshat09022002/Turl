import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const GeneratorBar = () => {
  return (
    <>
      <div className="mt-20">
        <PlaceholdersAndVanishInput
          placeholders={["Enter a URL to shorten"]}
          onChange={(e) => e.target.value}
          onSubmit={() => {
            console.log("submitted");
          }}
        ></PlaceholdersAndVanishInput>
      </div>
    </>
  );
};

export default GeneratorBar;
