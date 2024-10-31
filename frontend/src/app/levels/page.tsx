// Components
import ListLevels from "@/components/Levels/ListLevels";
import CreateLevelButtonDialog from "@/components/Levels/CreateLevelButtonDialog";

export default function Levels() {
  return (
    <main>
      <section className="flex m-5">
        {/* Titulo pagina*/}
        <h1 className="font-bold text-xl flex-grow">Levels</h1>
        {/* Componente que Cria a tarefa */}
        <CreateLevelButtonDialog />
      </section>

      {/* Componente que Lista a tarefa*/}
      <ListLevels />
    </main>
  );
}
