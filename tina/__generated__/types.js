export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const HomePartsFragmentDoc = gql`
    fragment HomeParts on Home {
  __typename
  seo_title
  banner {
    __typename
    enabled
    heading
    text
    placeholder
    button
  }
  navbar {
    __typename
    logo
    cta_label
    cta_href
  }
  hero_background
  hero_heading
  hero_text
  hero_buttons {
    __typename
    label
    href
  }
  navbar_links {
    __typename
    label
    href
    dropdown
  }
  about {
    __typename
    tagline
    heading
    text
    image
    buttons {
      __typename
      label
      href
    }
  }
  menu {
    __typename
    tag
    heading
    text
    tabs {
      __typename
      id
      label
      tag
      heading
      text
      image
    }
  }
  testimonials {
    __typename
    heading
    text
    items {
      __typename
      quote
      stars
      avatar
      name
      role
    }
  }
  faq {
    __typename
    heading
    text
    items {
      __typename
      q
      a
    }
    still_heading
    still_text
    still_button
  }
  contact {
    __typename
    tagline
    heading
    text
    email
    phone
  }
  cta {
    __typename
    heading
    text
    buttons {
      __typename
      label
      href
      variant
    }
  }
  footer {
    __typename
    wordmark
    columns {
      __typename
      heading
      links {
        __typename
        label
        href
      }
    }
    newsletter_heading
    newsletter_text
    placeholder
    button
    fineprint
    copyright
    legal_links {
      __typename
      label
      href
    }
    notice_lead
    notice
  }
}
    `;
export const ConfigPartsFragmentDoc = gql`
    fragment ConfigParts on Config {
  __typename
  seo {
    __typename
    title
    description
  }
  nav {
    __typename
    title
    link
  }
  footerNote
}
    `;
export const HomeDocument = gql`
    query home($relativePath: String!) {
  home(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...HomeParts
  }
}
    ${HomePartsFragmentDoc}`;
export const HomeConnectionDocument = gql`
    query homeConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: HomeFilter) {
  homeConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...HomeParts
      }
    }
  }
}
    ${HomePartsFragmentDoc}`;
export const ConfigDocument = gql`
    query config($relativePath: String!) {
  config(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...ConfigParts
  }
}
    ${ConfigPartsFragmentDoc}`;
export const ConfigConnectionDocument = gql`
    query configConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: ConfigFilter) {
  configConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...ConfigParts
      }
    }
  }
}
    ${ConfigPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    home(variables, options) {
      return requester(HomeDocument, variables, options);
    },
    homeConnection(variables, options) {
      return requester(HomeConnectionDocument, variables, options);
    },
    config(variables, options) {
      return requester(ConfigDocument, variables, options);
    },
    configConnection(variables, options) {
      return requester(ConfigConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "https://content.tinajs.io/3.0/content/028e674c-8b03-47a6-9e0c-a5e6c31c2ef6/github/main",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
