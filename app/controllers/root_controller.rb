class RootController < ApplicationController
	def root
		render :root
	end

	def trace
		@code = params[:code]

		@result = RubyProf.profile do
			eval(@code)
		end
		
		@thread = @result.threads[0]

		render :root_node
	end

	private
	def root_params
		params.require(:trace).permit(:path, :arguments)
	end
end
