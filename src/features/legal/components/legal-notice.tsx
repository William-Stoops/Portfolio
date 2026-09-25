import { CONTACT_EMAIL, HOSTING_PROVIDER, SITE_OWNER } from '@/config/site';
import { LegalBlock } from '@/features/legal/components/legal-block';

export function LegalNotice() {
  return (
    <>
      <LegalBlock title="Éditeur">
        <p>
          Ce site est édité à titre personnel par <strong>{SITE_OWNER}</strong>, également directeur
          de la publication.
        </p>
        <p>
          Contact : <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </LegalBlock>

      <LegalBlock title="Hébergement">
        <p>
          <strong>{HOSTING_PROVIDER.name}</strong>
          <br />
          {HOSTING_PROVIDER.address}
          <br />
          Téléphone : {HOSTING_PROVIDER.phone}
          <br />
          <a href={HOSTING_PROVIDER.website}>{HOSTING_PROVIDER.website}</a>
        </p>
      </LegalBlock>

      <LegalBlock title="Données personnelles et cookies">
        <p>Ce site ne collecte aucune donnée personnelle et ne dépose aucun cookie.</p>
        <ul>
          <li>
            Le choix du thème (clair, sombre ou système) est enregistré dans le stockage local de
            votre navigateur. Il n’est transmis à personne et s’efface avec les données du site.
          </li>
          <li>
            Le formulaire de contact n’envoie rien à un serveur : il prépare un e-mail dans votre
            propre messagerie, que vous choisissez d’envoyer ou non.
          </li>
          <li>
            La vidéo YouTube n’est chargée, depuis youtube-nocookie.com, que si vous la lancez.
            YouTube applique alors sa propre politique de confidentialité.
          </li>
          <li>
            L’hébergeur peut traiter des journaux techniques (dont l’adresse IP) nécessaires au
            fonctionnement et à la sécurité du service.
          </li>
        </ul>
      </LegalBlock>

      <LegalBlock title="Propriété intellectuelle">
        <p>
          Les textes et la photographie de ce site ne peuvent être reproduits sans autorisation.
        </p>
        <p>
          Polices Sora et Inter sous licence SIL Open Font License, icônes Lucide sous licence ISC.
        </p>
      </LegalBlock>
    </>
  );
}
