import { InitialazerService } from './initialazer.service';

export function configurationFactory(
  Provider: InitialazerService
): () => Promise<any> {
  return () => Provider.Init();
}
