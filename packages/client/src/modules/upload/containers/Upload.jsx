import React from "react";
import { graphql, compose } from "react-apollo";

import UploadView from "../components/UploadView";
import FILES_QUERY from "../graphql/FilesQuery.graphql";
import UPLOAD_FILES from "../graphql/UploadFiles.graphql";
import REMOVE_FILE from "../graphql/RemoveFile.graphql";
import translate from "../../../i18n";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      answer: {
        check: null,
        supplier: null,
        doc: null,
        date: null,
        netValue: null,
        qty: null,
        vatRegID: null,
        status: null,
        loading_spinner: false
      }
    };
  }

  Uploading = () => {
    console.log("Upload");
    this.setState({
      answer: {
        loading_spinner: true
      }
    });
    setTimeout(this.Splitting, 2000);
  };

  Splitting = () => {
    console.log("Splitting");
    this.setState({
      answer: {
        status: "Splitting",
        loading_spinner: true
      }
    });
    setTimeout(this.Recognizing, 5000);
  };

  Recognizing = () => {
    console.log("Recognizing");
    this.setState({
      answer: {
        status: "Recognizing",
        loading_spinner: true
      }
    });
    setTimeout(this.Done, 5000);
  };

  Done = () => {
    console.log("Done");
    this.setState({
      answer: {
        check: "1/3",
        supplier: "Jhon",
        doc: "216",
        date: "18.02.2019",
        netValue: "132.00",
        qty: "23",
        vatRegID: "ei123",
        status: "Done",
        loading_spinner: false
      }
    });
  };

  handleUploadFiles = async files => {
    const { uploadFiles } = this.props;
    const result = await uploadFiles(files);
    this.Uploading();
    this.setState({
      error: result && result.error ? result.error : null,
      answer: {
        status: "Uploading",
        loading_spinner: true
      }
    });
  };

  handleRemoveFile = async id => {
    const { removeFile } = this.props;
    const result = await removeFile(id);

    this.setState({ error: result && result.error ? result.error : null });
  };

  render() {
    return (
      <UploadView
        {...this.props}
        error={this.state.error}
        answer={this.state.answer}
        handleRemoveFile={this.handleRemoveFile}
        handleUploadFiles={this.handleUploadFiles}
      />
    );
  }
}

export default compose(
  graphql(FILES_QUERY, {
    options: () => {
      return {
        fetchPolicy: "cache-and-network"
      };
    },
    props({ data: { loading, error, files } }) {
      if (error) throw new Error(error);

      return { loading, files };
    }
  }),
  graphql(UPLOAD_FILES, {
    props: ({ mutate }) => ({
      uploadFiles: async files => {
        try {
          await mutate({
            variables: { files },
            refetchQueries: [{ query: FILES_QUERY }]
          });
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  graphql(REMOVE_FILE, {
    props: ({ mutate }) => ({
      removeFile: async id => {
        try {
          await mutate({
            variables: { id },
            optimisticResponse: {
              __typename: "Mutation",
              removeFile: {
                removeFile: true,
                __typename: "File"
              }
            },
            update: store => {
              const cachedFiles = store.readQuery({ query: FILES_QUERY });

              store.writeQuery({
                query: FILES_QUERY,
                data: {
                  files: cachedFiles.files.filter(file => file.id !== id)
                }
              });
            }
          });
        } catch (e) {
          return { error: e.graphQLErrors[0].message };
        }
      }
    })
  }),
  translate("upload")
)(Upload);
