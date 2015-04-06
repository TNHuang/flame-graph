class RootController < ApplicationController
	def root
		render :root
	end

	def trace
		@code = params[:code]

		RubyProf.start
			eval(@code)
		@result = RubyProf.stop
		
		@thread = @result.threads[0]

		render :root_node
	end

	private
	def root_params
		params.require(:trace).permit(:path, :arguments)
	end
end
